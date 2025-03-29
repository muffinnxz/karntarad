import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import admin from "@/lib/firebase-admin";
import Together from "together-ai";
import { Post } from "@/interfaces/Post";
import { uploadBase64 } from "@/lib/firebase-storage";

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

    // Example character list string (for testing)
    //   const characterListStr = `[
    //   {
    //     "id": "char1",
    //     "name": "Vision Vera",
    //     "handle": "@FutureFlows",
    //     "image": "A futuristic avatar with AR glasses and glowing UI elements",
    //     "description": "Vera is a forward-thinking strategist with a passion for AI trends and predictive analytics. As a digital seer, she crafts marketing roadmaps that anticipate customer behavior and position KhuiAI at the cutting edge of interaction technology."
    //   },
    //   {
    //     "id": "char2",
    //     "name": "Brandon Spark",
    //     "handle": "@BuzzBuilder",
    //     "image": "A charismatic avatar in a branded hoodie with a spark emoji on his chest",
    //     "description": "Brandon is the hype master of social storytelling. He knows how to take KhuiAI’s character tech and build viral campaigns that turn product launches into cultural moments. His energy is magnetic, and his focus is always on engagement and shareability."
    //   },
    //   {
    //     "id": "char3",
    //     "name": "Analytics Ada",
    //     "handle": "@MetricsMuse",
    //     "image": "A sharp-looking avatar surrounded by data dashboards and infographics",
    //     "description": "Ada is a data-driven digital analyst who turns numbers into narratives. She excels at A/B testing, conversion funnel optimization, and real-time campaign adjustments. For KhuiAI, she tracks which personalities win hearts—and which need rewiring."
    //   },
    //   {
    //     "id": "char4",
    //     "name": "Nostalgia Nia",
    //     "handle": "@RetroReels",
    //     "image": "A 90s-themed avatar with a vintage camcorder and Polaroids",
    //     "description": "Nia brings a retro twist to digital marketing, tapping into emotional resonance through throwback campaigns. She specializes in brand storytelling and uses KhuiAI’s characters to recreate classic narratives with a modern AI twist."
    //   },
    //   {
    //     "id": "char5",
    //     "name": "Prompt Pete",
    //     "handle": "@PromptlyYours",
    //     "image": "A quirky character with a digital notepad and floating text bubbles",
    //     "description": "Pete is a prompt engineer turned content wizard. He uses AI-generated dialogue to create interactive, character-led marketing copy. With a knack for crafting immersive campaigns, he helps KhuiAI showcase the true power of dynamic personality design."
    //   },
    //   {
    //     "id": "char6",
    //     "name": "Engage Ellie",
    //     "handle": "@EllieEchos",
    //     "image": "A vibrant influencer-like avatar mid-livestream with a chat box overlay",
    //     "description": "Ellie thrives in live engagement spaces, from Q&As to character-led livestreams. She turns product launches into two-way conversations, helping KhuiAI show that AI characters can form real-time bonds with digital audiences."
    //   },
    //   {
    //     "id": "char7",
    //     "name": "Conversion Kai",
    //     "handle": "@ClickToKai",
    //     "image": "A clean-cut avatar with a clipboard, checklist, and a subtle dollar-sign pin",
    //     "description": "Kai is all about results. A performance marketer at heart, he zeroes in on ROI, lead-gen, and sales pipeline optimization. For KhuiAI, he ensures every character interaction leads toward a conversion goal—measurable and meaningful."
    //   },
    //   {
    //     "id": "char8",
    //     "name": "Viral Vee",
    //     "handle": "@LoopQueen",
    //     "image": "A bold, trend-savvy avatar with looping TikTok clips in the background",
    //     "description": "Vee is the queen of the viral loop. With expertise in short-form video and algorithmic trends, she launches KhuiAI’s personalities into the social spotlight. She knows what the internet loves—and how to make it talk back."
    //   },
    //   {
    //     "id": "char9",
    //     "name": "UX Uma",
    //     "handle": "@FlowWithUma",
    //     "image": "A minimalist avatar with wireframes and touch gestures surrounding her",
    //     "description": "Uma is a user experience designer turned content strategist. She integrates KhuiAI characters into seamless customer journeys, ensuring that storytelling, UI, and engagement work in harmony. She’s calm, calculated, and customer-obsessed."
    //   },
    //   {
    //     "id": "char10",
    //     "name": "Crisis Chris",
    //     "handle": "@FixItFast",
    //     "image": "A confident avatar in a blazer with a fire extinguisher emoji pin",
    //     "description": "Chris is the brand’s PR and reputation warrior. Specializing in AI ethics and crisis response, he’s the go-to bot when a campaign stumbles or controversy arises. He helps KhuiAI maintain transparency, trust, and a human touch—even in the AI age."
    //   }
    // ]`


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
      apiKey: process.env.TOGETHER_API_KEY,
    });
    const responseLikeCount = await together.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "user",
          content: finalMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    console.log("responseLikeCount from Together API is:", responseLikeCount);
    const aiOutput = responseLikeCount?.choices[0]?.message?.content;
    if(!aiOutput) {
      return NextResponse.json({ message: "AI response is incorrect." }, { status: 500 });
    }
    const likeCount = parseInt(aiOutput?.trim(), 10);
    console.log("Estimated like count by ai is:", likeCount);

    
    


    // 3. bots create posts
    





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
