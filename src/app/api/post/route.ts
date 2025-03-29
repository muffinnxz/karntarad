import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
const Together = require("together-ai");

export async function POST(req: NextRequest) {

    // Authenticate user
  const auth = await authMiddleware(req);

  if (auth instanceof NextResponse) return auth; // Return 401 response if unauthorized
  
}