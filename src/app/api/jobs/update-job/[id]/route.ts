import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { verifyToken } from "@/app/lib/auth";
import Jobs from "@/app/models/Jobs";
import User from "@/app/models/User";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid Job ID" }),
        { status: 400 }
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

    // Find and update job
    const job = await Jobs.findById(id);
    if (!job) {
      return new Response(
        JSON.stringify({ success: false, message: "Job not found" }),
        { status: 404 }
      );
    }

    job.position = position || job.position;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;
    job.type = type || job.type;
    job.level = level || job.level;
    job.department = department || job.department;

    const updatedJob = await job.save();

    return NextResponse.json(
      { success: true, message: "Job updated successfully", updatedJob },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error updating job" },
      { status: 500 }
    );
  }
}
