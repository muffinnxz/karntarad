import { NextRequest, NextResponse } from "next/server";
import { createGame, getGamesByUserId, getGameById, deleteGame, updateGame } from "@/services/game.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getUser } from "@/services/user.service";

export const maxDuration = 300;

/**
 * ✅ Handles GET request for fetching a game by ID or all games by user ID
 * @param request - The request object
 * @returns A response object with the game details or all games by user ID
 */
export async function GET(request: NextRequest) {
  const auth = await authMiddleware(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const user = await getUser(auth.user.uid);
    if (!user.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("id");

    if (gameId) {
      // Fetch a single game by ID
      const game = await getGameById(gameId);
      console.log("Fetched Game:", game);

      if (!game || Object.keys(game).length === 0) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
      return NextResponse.json(game);
    } else {
      // Fetch all games by user ID
      const games = await getGamesByUserId(user.id);
      return NextResponse.json(games);
    }
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error fetching game(s)" }, { status: 500 });
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
    return NextResponse.json(
      { error: error, message: "Error creating game, companyId or scenarioId is invalid" },
      { status: 500 }
    );
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
    const { gameId, day, result, followerCount } = body;
    if (!gameId || !day || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const game = await updateGame(gameId, day, result, followerCount || 0);
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error updating game" }, { status: 500 });
  }
}
