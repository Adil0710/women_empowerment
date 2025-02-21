import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password, phone, emergencyContacts } = await req.json();

    if (!name || !email || !password || !phone || !emergencyContacts) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      emergencyContacts,
    });

    return NextResponse.json({ success: true, message: "User registered successfully" , newUser}, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Error signing up" }, { status: 500 });
  }
}
