import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Error logging in" }, { status: 500 });
  }
}
