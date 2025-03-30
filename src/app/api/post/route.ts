import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import admin from "@/lib/firebase-admin";
import Together from "together-ai";
import { Post } from "@/interfaces/Post";
import { uploadBase64 } from "@/lib/firebase-storage";
import { Character } from "@/interfaces/Character";
import { getGame, updateGame } from "@/services/game.service";
import path from "path";
import fs from "fs";

export const maxDuration = 300;

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

    const game = await getGame(gameId);

    const imageUrl = image ? await uploadBase64(image, `${gameId}-${day}-${decodedUser.uid}`) : "";

    // 1. decide like and follower change

    const generateLikeCountFile = path.join(process.cwd(), "src/prompts/adjust-like-count.txt");
    const likeCountContent = fs.readFileSync(generateLikeCountFile, "utf-8");

    const likeCountPrompt = likeCountContent
      .replace("{{company}}", JSON.stringify(game.company, null, 2))
      .replace("{{scenario}}", JSON.stringify(game.scenario, null, 2))
      .replace("{{characterListStr}}", JSON.stringify(game.characterList, null, 2))
      .replace("{{postText}}", text);

    // together api call
    const together = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });
    const responseLikeCount = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "system",
          content: likeCountPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 512,
      response_format: { type: "json_object" }
    });

    console.log("responseLikeCount from Together API is:", responseLikeCount);
    const aiOutput = responseLikeCount?.choices[0]?.message?.content;
    if (!aiOutput) {
      return NextResponse.json({ message: "AI response is incorrect." }, { status: 500 });
    }
    const likeCountJson = JSON.parse(aiOutput);

    console.log("likeCountJson is:", likeCountJson);
    console.log("Estimated like count by ai is:", likeCountJson.likes);

    // 2. user create post
    const firestore = admin.firestore();
    const newDocRef = firestore.collection("posts").doc(); // auto-generate doc ID
    const newPost: Post = {
      id: newDocRef.id,
      gameId,
      day,
      creator: {
        name: game.company.name,
        username: game.company.username,
        image: game.company.companyProfileURL
      },
      text,
      numLikes: likeCountJson.likes,
      image: imageUrl
    };

    // Save to Firestore
    await newDocRef.set(newPost);
    console.log("Post created successfully:", newPost);

    // 3. bots create posts

    // Read the generate-next-day prompt template
    const generateNextDayFile = path.join(process.cwd(), "src/prompts/generate-next-day.txt");
    const generateNextDayContent = fs.readFileSync(generateNextDayFile, "utf8");

    const company = {
      name: game.company.name,
      description: game.company.description,
      username: game.company.username
    };

    const scenario = {
      name: game.scenario.name,
      description: game.scenario.description
    };

    const characters = game.characterList;
    const postText = text;

    const postsSnapshot = await firestore.collection("posts").where("gameId", "==", gameId).get();
    const filteredPreviousPosts = postsSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          creator: {
            username: data.creator.username
          },
          text: data.text,
          numLikes: data.numLikes,
          image: data.image,
          day: data.day
        };
      })
      .sort((a, b) => a.day - b.day);

    console.log("Filtered previous posts:", filteredPreviousPosts);

    // Replace the placeholders in the template
    const finalPrompt = generateNextDayContent
      .replace(/{{company}}/g, JSON.stringify(company, null, 2))
      .replace(/{{scenario}}/g, JSON.stringify(scenario, null, 2))
      .replace(/{{characters}}/g, JSON.stringify(characters, null, 2))
      .replace(/{{post_history}}/g, JSON.stringify(filteredPreviousPosts, null, 2))
      .replace(/{{user_post}}/g, JSON.stringify({ text: postText, image: imageUrl }, null, 2))
      .replace(/{{current_day}}/g, JSON.stringify(day, null, 2));

    console.log("Final character prompt to AI:", finalPrompt);

    // Together API call for generating character posts
    const togetherForCharacterPosts = new Together({
      apiKey: process.env.TOGETHER_API_KEY
    });

    const responseCharacterPosts = await togetherForCharacterPosts.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: finalPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" }
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

    let aiPosts: Array<{ username: string; content: string; likes: number; sentiment: string }> = [];
    try {
      aiPosts = JSON.parse(cleanedOutput);
    } catch (err) {
      throw new Error("Failed to parse AI character posts output: " + err);
    }

    console.log("AI-generated posts:", aiPosts);

    // Create a lookup map for characters using their ID as key
    const characterMap = new Map<string, Character>(); // Replace 'any' with your Character interface type if available
    for (const character of game.characterList) {
      if (character.username) {
        characterMap.set(character.username, character);
      }
    }

    console.log("Character map:", characterMap);

    const createPost = async (v: { username: string; content: string; likes: number; sentiment: string }) => {
      const postRef = firestore.collection("posts").doc();

      const character = characterMap.get(v.username);

      await postRef.set({
        id: postRef.id,
        gameId: game.id,
        day: day + 1,
        creator: {
          name: character?.name || "Unknown",
          username: character?.username || "Unknown",
          image: character?.image || ""
        },
        text: v.content,
        numLikes: v.likes || 0,
        sentiment: v.sentiment
      });
    };

    await Promise.all(aiPosts.map(createPost));

    console.log("AI-generated posts have been saved to Firestore.");

    await updateGame(
      gameId,
      day + 1,
      day + 1 === 7 ? "completed" : "in_progress",
      game.followerCount + likeCountJson.likes
    );
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
