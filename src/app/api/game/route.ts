import { NextRequest, NextResponse } from "next/server";
import { createGame, getGamesByUserId, deleteGame, updateGame } from "@/services/game.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getUser } from "@/services/user.service";

/**
 * ✅ Handles GET request for fetching all games by user id
 * @param request - The request object
 * @returns A response object with all games by user id
 */
export async function GET(request: NextRequest) {
	const auth = await authMiddleware(request);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);
		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}
		const games = await getGamesByUserId(user.id);
		return NextResponse.json(games);
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error fetching games" }, { status: 500 });
	}
}

/**
 * ✅ Handles POST request for creating a game
 * @param request - The request object
 * @returns A response object with the created game
 */
export async function POST(request: NextRequest) {
	const auth = await authMiddleware(request);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);
		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}
		const body = await request.json();
		const { companyId, scenarioId } = body;
		if (!companyId || !scenarioId) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
		const game = await createGame(user.id, companyId, scenarioId);
		return NextResponse.json(game);
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error creating game, companyId or scenarioId is invalid" }, { status: 500 });
	}

}

/**
 * ✅ Handles DELETE request for deleting a game
 * @param request - The request object
 * @returns A response object with the deleted game
 */
export async function DELETE(request: NextRequest) {
	const auth = await authMiddleware(request);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);
		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}
		const body = await request.json();
		const { gameId } = body;
		if (!gameId) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
		const game = await deleteGame(gameId);
		return NextResponse.json(game);
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error deleting game" }, { status: 500 });
	}
}


/**
 * ✅ Handles PUT request for updating a game
 * @param request - The request object
 * @returns A response object with the updated game
 */
export async function PUT(request: NextRequest) {
	const auth = await authMiddleware(request);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);
		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}
		const body = await request.json();
		const { gameId, companyId, scenarioId, day, result } = body;
		if (!gameId || !companyId || !scenarioId || !day || !result) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}
		const game = await updateGame(gameId, user.id, companyId, scenarioId, day, result);
		return NextResponse.json(game);
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error updating game" }, { status: 500 });
	}
}

