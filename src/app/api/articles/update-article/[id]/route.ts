import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { verifyToken } from "@/app/lib/auth";

import User from "@/app/models/User";
import mongoose from "mongoose";
import Article from "@/app/models/Article";

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
        JSON.stringify({ success: false, message: "Invalid article ID" }),
        { status: 400 }
      );
    }

    const { title, description, link } = await req.json();

    // Find and update article
    const article = await Article.findById(id);
    if (!article) {
      return new Response(
        JSON.stringify({ success: false, message: "article not found" }),
        { status: 404 }
      );
    }

    article.title = title || article.title;

    article.description = description || article.description;

    article.link = link || article.link;

    const updatedarticle = await article.save();

    return NextResponse.json(
      {
        success: true,
        message: "article updated successfully",
        updatedarticle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error updating article" },
      { status: 500 }
    );
  }
}
