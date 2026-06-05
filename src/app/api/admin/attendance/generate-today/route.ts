import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyUser } from "@/lib/verifyUser";
import HourlyCode from "@/models/HourlyCode";
import { generateCodesForDate, getISTMidnight } from "@/lib/generateHourlyCodes";

async function requireAdmin() {
  const user: any = await verifyUser();
  if (!user || user.role !== "admin") throw new Error("UNAUTHORIZED");
  return user;
}

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();

    const today = getISTMidnight();
    console.log("📅 Generating for TODAY (IST):", today.toISOString().split("T")[0]);

    // Delete existing for today
    await HourlyCode.deleteMany({ date: today });

    // Generate fresh
    await generateCodesForDate(new Date());

    return NextResponse.json({
      success: true,
      message: "Today's codes generated successfully!",
      date: today.toISOString().split("T")[0],
    });
  } catch (error: any) {
    if (["UNAUTHORIZED", "NO_TOKEN", "TOKEN_EXPIRED"].includes(error.message)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}