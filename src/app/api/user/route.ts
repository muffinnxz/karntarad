import { NextRequest, NextResponse } from "next/server";
import { getUser, createUser } from "@/services/user.service";
import { authMiddleware } from "@/middleware/authMiddleware";

export const maxDuration = 300;

/**
 * ✅ Handle GET request - Fetch user data
 */
export async function GET(req: NextRequest) {
	// ✅ Authenticate user
	const auth = await authMiddleware(req);
	if (auth instanceof NextResponse) return auth; // Return 401 response if unauthorized

	try {
		const user = await getUser(auth.user.uid);
		if (!user.exists) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Success", data: user.data() }, { status: 200 });
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
	}
}

/**
 * ✅ Handle POST request - Create new user
 */
export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const { id: userId, displayName, email, photoURL } = body;

		if (!userId || !displayName || !email) {
			return NextResponse.json({ message: "Bad request: Missing required fields" }, { status: 400 });
		}

		const userData = await getUser(userId);
		if (userData?.exists) {
			return NextResponse.json({ message: "User already exists" }, { status: 200 });
		}

		const user = await createUser(userId, displayName, email, photoURL);
		if (!user) {
			throw new Error("User creation failed");
		}

		return NextResponse.json({ message: "User created successfully", data: user }, { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
	}
}
