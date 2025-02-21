import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { verifyToken } from "@/app/lib/auth";

export async function GET(req: Request) {
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
  
    // Fetch all users excluding passwords
    const users = await User.find().select("-password");
    return NextResponse.json({ success: true, users });
 } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error fetching users" },
      { status: 500 }
    );
 }
}
