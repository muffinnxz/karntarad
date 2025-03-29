import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
const Together = require("together-ai");

export async function POST(req: NextRequest) {

    // Authenticate user
  const auth = await authMiddleware(req);

  if (auth instanceof NextResponse) return auth; // Return 401 response if unauthorized


  try {

    const { gameId, day, text, image } = await req.json();
    const { user } = auth.user; // Extract user from auth middleware

    // Validate required fields
    if (!gameId || day === undefined || text === undefined) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }
    if (day < 0 || day > 6) {
      return NextResponse.json({ message: "Day must be between 0 and 6." }, { status: 400 });
    }


    


  } catch (error) {
    console.error("creating post.", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }



  // character (ai )create post

  
}







// export interface Post {
//   id: string;
//   gameId: string;
//     day: DayType;
//     user?: User;        // post from the real user
//     character?: Character; // post from AI character
//     text: string;
//     numLikes: number;
//     image?: string;
// }


