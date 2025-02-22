import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import { verifyToken } from "@/app/lib/auth";
import User from "@/app/models/User";

export async function PUT(req: Request) {
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
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const { name, email, phone, emergencyContacts, newPassword } = await req.json();

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (emergencyContacts) user.emergencyContacts = emergencyContacts;

    // Handle password update (Only hash if new password is provided)
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Save updated user
    await user.save();

    return NextResponse.json(
      { success: true, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error updating profile" },
      { status: 500 }
    );
  }
}
