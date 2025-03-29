import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin"; // Firebase Admin SDK instance

export interface AuthenticatedNextRequest extends NextRequest {
	user: admin.auth.DecodedIdToken;
}

/**
 * Middleware to authenticate Firebase users in Next.js 14 App Router (NextRequest)
 */
export async function authMiddleware(req: NextRequest): Promise<{ user: admin.auth.DecodedIdToken } | NextResponse> {
	const authorization = req.headers.get("authorization");

	if (!authorization || !authorization.startsWith("Bearer ")) {
		return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
	}

	const token = authorization.split("Bearer ")[1];        // to be commented.
	console.log("token from authMiddleware is", token);     // to be commented

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);

		// console.log("decodedToken from authMiddleware is", decodedToken);     // to be commented

		return { user: decodedToken }; // ✅ Return user object instead of modifying `req`
	} catch (error) {
		console.error("Error verifying ID token:", error);
		return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
	}
}
