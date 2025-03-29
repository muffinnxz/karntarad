import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import admin from "@/lib/firebase-admin";
const Together = require("together-ai");
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
