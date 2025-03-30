// src/app/api/post/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import admin from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { postId } = await req.json();
    if (!postId) {
      return NextResponse.json({ message: "Missing postId" }, { status: 400 });
    }

    const postRef = admin.firestore().collection("posts").doc(postId);
    const postDoc = await postRef.get();
    if (!postDoc.exists) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const postData = postDoc.data();
    if (!postData) {
      return NextResponse.json({ message: "Post data missing" }, { status: 404 });
    }

    // Toggle the like status.
    let updatedLikeStatus: boolean;
    let updatedNumLikes = postData.numLikes || 0;
    if (postData.isLikeByUser) {
      // User already liked; unlike the post.
      updatedLikeStatus = false;
      updatedNumLikes = updatedNumLikes - 1;
    } else {
      // Otherwise, like the post.
      updatedLikeStatus = true;
      updatedNumLikes = updatedNumLikes + 1;
    }

    await postRef.update({ isLikeByUser: updatedLikeStatus, numLikes: updatedNumLikes });
    return NextResponse.json(
      { message: "Like toggled", isLikeByUser: updatedLikeStatus, numLikes: updatedNumLikes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
