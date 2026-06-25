import { NextRequest, NextResponse } from "next/server";
import { updateAchievement, deleteAchievement } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ach = await req.json();
    const result = await updateAchievement(params.id, ach);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await deleteAchievement(params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete achievement" }, { status: 500 });
  }
}
