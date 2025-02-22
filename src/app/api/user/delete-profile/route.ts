import { verifyToken } from "@/app/lib/auth";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
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
  
      // Find and delete the user
      const deletedUser = await User.findByIdAndDelete(decoded.id);
      if (!deletedUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, message: "Account deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Error deleting account" },
        { status: 500 }
      );
    }
  }
  