import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { verifyToken } from "@/app/lib/auth";
import Jobs from "@/app/models/Jobs";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Get token from request headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token and extract user info
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // Find the logged-in user
    const loggedInUser = await User.findById(decoded.id);
    if (!loggedInUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if the logged-in user is an admin
    if (loggedInUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const {
      position,
      company,
      location,
      description,
      type,
      level,
      department,
    } = await req.json();

    if (
      !position ||
      !company ||
      !location ||
      !description ||
      !type ||
      !level ||
      !department
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newJob = await Jobs.create({
        position,
        company,
        location,
        description,
        type,
        level,
        department,
    })

    return NextResponse.json({ success: true, message: "Job added successfully" , newJob}, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error adding job" },
      { status: 500 }
    );
  }
}
