import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, updateSection } from "@/lib/db";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error (portfolio GET):", error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { section, data } = body;
    if (!section || !data) {
      return NextResponse.json({ error: "Missing section or data in request body" }, { status: 400 });
    }
    
    const validSections = ["hero", "about", "experience", "education", "projects", "skills", "techBubbles"];
    if (!validSections.includes(section)) {
      return NextResponse.json({ error: "Invalid section name" }, { status: 400 });
    }

    const result = await updateSection(section, data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error (portfolio POST):", error);
    return NextResponse.json({ error: error.message || "Failed to update portfolio data" }, { status: 500 });
  }
}
