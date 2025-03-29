import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getUser } from "@/services/user.service";
import { createScenario, getTenRandomScenarios, getScenariosByUserId, deleteScenario, updateScenario } from "@/services/scenario.service";


/**
 * ✅ Handles GET request for fetching 2 types of scenarios
 * 1. user's own scenarios
 * 2. random scenarios from other users
 * @param request - The request object
 * @returns A response object with all scenarios
 */
export async function GET(req: NextRequest) {
	const auth = await authMiddleware(req);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);

		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const userScenarios = await getScenariosByUserId(user.id);

		const communityScenarios = await getTenRandomScenarios(user.id);

		return NextResponse.json({ userScenarios: userScenarios, communityScenarios: communityScenarios }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error fetching scenarios" }, { status: 500 });
	}
}

/**
 * ✅ Handles POST request for creating a new scenario
 * @param request - The request object
 * @returns A response object with the created scenario
 */
export async function POST(req: NextRequest) {
	const auth = await authMiddleware(req);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);

		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const body = await req.json();

		const { name, description, isPublic } = body;

		if (!name || !description || isPublic === undefined) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const scenario = await createScenario(user.id, name, description, isPublic);

		return NextResponse.json(scenario, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error creating scenario" }, { status: 500 });
	}
}

/**
 * ✅ Handles DELETE request for deleting a scenario
 * @param request - The request object
 * @returns A response object with the deleted scenario
 */
export async function DELETE(req: NextRequest) {
	const auth = await authMiddleware(req);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);

		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const body = await req.json();
		const { id } = body;

		if (!id) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const scenario = await deleteScenario(id);
		return NextResponse.json(scenario, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error deleting scenario" }, { status: 500 });
	}
}

/**
 * ✅ Handles PUT request for updating a scenario
 * @param request - The request object
 * @returns A response object with the updated scenario
 */
export async function PUT(req: NextRequest) {
	const auth = await authMiddleware(req);
	if (auth instanceof NextResponse) return auth;

	try {
		const user = await getUser(auth.user.uid);

		if (!user.exists) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const body = await req.json();
		const { id, name, description } = body;

		if (!id || !name || !description) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const scenario = await updateScenario(id, name, description);
		return NextResponse.json(scenario, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error, message: "Error updating scenario" }, { status: 500 });
	}
}
