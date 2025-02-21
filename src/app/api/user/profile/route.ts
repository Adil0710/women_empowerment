import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import { verifyToken } from "@/app/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id).select("-password");
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Error getting profile" },
      { status: 500 }
    );
  }
}
