import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { getUser } from "@/services/user.service";
import {
  createCompany,
  getTenRandomCompanies,
  getCompaniesByUserId,
  deleteCompany,
  updateCompany
} from "@/services/company.service";

/**
 * ✅ Handles GET request for fetching 2 types of companies
 * 1. user's own companies
 * 2. random companies from other users
 * @param request - The request object
 * @returns A response object with all companies
 */
export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const user = await getUser(auth.user.uid);

    if (!user.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const userCompanies = await getCompaniesByUserId(user.id);
    const communityCompanies = await getTenRandomCompanies(user.id);

    return NextResponse.json({ userCompanies: userCompanies, communityCompanies: communityCompanies }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error fetching companies" }, { status: 500 });
  }
}

/**
 * ✅ Handles POST request for creating a new company
 * @param request - The request object
 * @returns A response object with the created company
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
    const { name, description, companyProfilePicture, isPublic } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const company = await createCompany(user.id, name, description, companyProfilePicture, isPublic);
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error creating company" }, { status: 500 });
  }
}

/**
 * ✅ Handles DELETE request for deleting a company
 * @param request - The request object
 * @returns A response object with the deleted company
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

    const company = await deleteCompany(id);
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error deleting company" }, { status: 500 });
  }
}

/**
 * ✅ Handles PUT request for updating a company
 * @param request - The request object
 * @returns A response object with the updated company
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
    const { id, name, description, companyProfilePicture } = body;

    if (!id || !name || !description || !companyProfilePicture) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const company = await updateCompany(id, name, description, companyProfilePicture);
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error, message: "Error updating company" }, { status: 500 });
  }
}
