import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import admin from "@/lib/firebase-admin";
import Together from "together-ai";
import { Post } from "@/interfaces/Post";
import { uploadBase64 } from "@/lib/firebase-storage";
import { Character } from "@/interfaces/Character";

export async function POST(req: NextRequest) {
  // Authenticate user
  const auth = await authMiddleware(req);

  if (auth instanceof NextResponse) return auth; // Return 401 response if unauthorized

  try {
    const { gameId, day, text, image } = await req.json();
    const decodedUser = auth.user; // Extract user from auth middleware

    // Validate required fields
    if (!gameId || day === undefined || text === undefined) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }
    if (day < 0 || day > 6) {
      return NextResponse.json({ message: "Day must be between 0 and 6." }, { status: 400 });
    }

    // 1. user create post
    const firestore = admin.firestore();
    const newDocRef = firestore.collection("posts").doc(); // auto-generate doc ID
    const newPost: Post = {
      id: newDocRef.id,
      gameId,
      day,
      user: {
        // The decoded token might not have all these fields
        id: decodedUser.uid,
        displayName: decodedUser.name ?? "",
        email: decodedUser.email ?? "",
        photoURL: decodedUser.picture ?? "",
        createdAt: new Date() // or load from Firestore if needed
      },
      text,
      numLikes: 0, // new post starts with 0 likes
      image: "" // will set below if we actually have an image
    };

    if (image) {
      // Use doc ID as storage path (you can append .jpg if you wish, e.g. `${newDocRef.id}.jpg`)
      const storagePath = newDocRef.id;
      const uploadedUrl = await uploadBase64(image, storagePath);
      newPost.image = uploadedUrl; // store the returned public URL
    }

    // Save to Firestore
    await newDocRef.set(newPost);
    console.log("Post created successfully:", newPost);

    // 2. decide like and follower change
    const gameDocRef = firestore.collection("games").doc(gameId);
    const gameDoc = await gameDocRef.get();

    if (!gameDoc.exists) {
      return NextResponse.json({ message: "Game not found." }, { status: 404 });
    }

    // Get the characterList field from the game doc
    const gameData = gameDoc.data();
    const { characterList } = gameData || {};

    // Ensure it’s a valid array
    if (!Array.isArray(characterList)) {
      return NextResponse.json({ message: "Invalid or missing characterList in game doc." }, { status: 400 });
    }

    // Convert it to a string (if you need to pass it to some external service or for logging)
    const characterListStr = JSON.stringify(characterList);

    const postText = text;

    // final message to be sent to the AI
    const fsPromises = await import("fs/promises");
    const promptTemplate = await fsPromises.readFile("src/prompts/likecount.txt", "utf8");
    const finalMessage = promptTemplate
      .replace(/{{characterListStr}}/g, characterListStr)
      .replace(/{{postText}}/g, postText);
    console.log("Final prompt to AI:", finalMessage);

    // together api call
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });
    const responseLikeCount = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: finalMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 512
    });

    console.log("responseLikeCount from Together API is:", responseLikeCount);
    const aiOutput = responseLikeCount?.choices[0]?.message?.content;
    if (!aiOutput) {
      return NextResponse.json({ message: "AI response is incorrect." }, { status: 500 });
    }
    const likeCount = parseInt(aiOutput?.trim(), 10);
    console.log("Estimated like count by ai is:", likeCount);

    // 3. bots create posts

    const companyDescription = gameData?.company?.description;
    const scenarioDescription = gameData?.scenario?.description;
    const companyUsername = gameData?.company?.username;
    // Query all previous posts for this game
    const postsSnapshot = await firestore.collection("posts").where("gameId", "==", gameId).get();
    const allPreviousPost = postsSnapshot.docs.map((doc) => doc.data());

    console.log("Company Description:", companyDescription);
    console.log("Scenario Description:", scenarioDescription);
    console.log("Company Username:", companyUsername);
    console.log("All previous posts:", allPreviousPost);

    // Read the character-create-post prompt template
    const characterPromptTemplate = await fsPromises.readFile("src/prompts/character-create-post.txt", "utf8");

    // allPreviousPost should be a JSON string of the previous posts
    const allPreviousPostStr = JSON.stringify(allPreviousPost);

    // Replace the placeholders in the template using regex
    const finalCharacterPrompt = characterPromptTemplate
      .replace(/{{characterListStr}}/g, characterListStr)
      .replace(/{{postText}}/g, postText)
      .replace(/{{companyDescription}}/g, companyDescription)
      .replace(/{{scenarioDescription}}/g, scenarioDescription)
      .replace(/{{allPreviousPost}}/g, allPreviousPostStr)
      .replace(/{{companyUsername}}/g, companyUsername);

    console.log("Final character prompt to AI:", finalCharacterPrompt);

    // Together API call for generating character posts
    const togetherForCharacterPosts = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });

    const responseCharacterPosts = await togetherForCharacterPosts.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: finalCharacterPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    console.log("Response from Together API for character posts:", responseCharacterPosts);

    const aiCharacterPostsOutput = responseCharacterPosts?.choices[0]?.message?.content;
    if (!aiCharacterPostsOutput) {
      throw new Error("AI response for character posts is incorrect.");
    }

    // Log the AI output (should be a JSON array with one post per character)
    console.log("Generated character posts from AI:", aiCharacterPostsOutput);

    // 4. replaceMap data preparation
    // Clean up the AI output to remove markdown formatting if present
    let cleanedOutput = aiCharacterPostsOutput.trim();
    if (cleanedOutput.startsWith("```")) {
      // Remove the starting and ending triple backticks and any language specifier (e.g. "```json")
      cleanedOutput = cleanedOutput.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let aiPosts: Array<{ characterId: string; text: string; numLikes: number }> = [];
    try {
      aiPosts = JSON.parse(cleanedOutput);
    } catch (err) {
      throw new Error("Failed to parse AI character posts output: " + err);
    }

    // Create a lookup map for characters using their ID as key
    const characterMap = new Map<string, Character>(); // Replace 'any' with your Character interface type if available
    for (const character of characterList) {
      characterMap.set(character.id, character);
    }

    // Map each AI post to a new Post object (omitting image, banner, and bio)
    const aiGeneratedPosts = aiPosts.map((aiPost) => {
      // Generate a new ID for the AI post
      const aiPostId = admin.firestore().collection("posts").doc().id;
      // Lookup the corresponding character from the characterList
      const characterObj = characterMap.get(aiPost.characterId);
      if (!characterObj) {
        throw new Error(`Character with id ${aiPost.characterId} not found in characterList.`);
      }

      // Return the mapped post object following the Post interface
      return {
        id: aiPostId,
        gameId: gameId,
        day: day,
        character: characterObj,
        text: aiPost.text,
        numLikes: 0 // initialize to 0
      };
    });

    // The aiGeneratedPosts array now serves as the replaceMap ready for actual posting.
    console.log("ReplaceMap for AI-generated posts:", aiGeneratedPosts);

    // 5. Create posts for each character
    for (const aiPost of aiGeneratedPosts) {
      // Create a document reference in the "posts" collection using the generated post id
      const aiPostDocRef = firestore.collection("posts").doc(aiPost.id);
      await aiPostDocRef.set(aiPost);
    }

    console.log("AI-generated posts have been saved to Firestore.");
  } catch (error) {
    console.error("creating post.", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json({ message: "Post created successfully." }, { status: 200 });
}

export async function GET(req: NextRequest) {
  // Authenticate user
  const auth = await authMiddleware(req);
  if (auth instanceof NextResponse) return auth; // Return 401 if unauthorized

  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const dayStr = searchParams.get("day");

    // Check for required gameId
    if (!gameId) {
      return NextResponse.json({ message: "Missing required field: gameId" }, { status: 400 });
    }

    // Create Firestore query
    const firestore = admin.firestore();
    let query = firestore.collection("posts").where("gameId", "==", gameId);

    // If day was provided, filter by day
    if (dayStr !== null) {
      const dayNum = parseInt(dayStr, 10);
      if (isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
        return NextResponse.json({ message: "Day must be an integer between 0 and 6." }, { status: 400 });
      }
      query = query.where("day", "==", dayNum);
    }

    // Execute query
    const snapshot = await query.get();
    const posts = snapshot.docs.map((doc) => doc.data());

    // Return posts array
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
