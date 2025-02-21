import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ success: true, message: "API is working!" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: "Error connecting to API" }, { status: 500 });
  }
}
