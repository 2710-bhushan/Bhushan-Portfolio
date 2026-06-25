import { NextRequest, NextResponse } from "next/server";
import { getAchievements, addAchievement } from "@/lib/db";

export async function GET() {
  try {
    const list = await getAchievements();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ach = await req.json();
    if (!ach.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const created = await addAchievement(ach);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create achievement" }, { status: 500 });
  }
}
