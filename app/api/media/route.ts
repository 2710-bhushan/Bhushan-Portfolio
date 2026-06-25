import { NextRequest, NextResponse } from "next/server";
import { getMedia, deleteMedia } from "@/lib/db";

export async function GET() {
  try {
    const list = await getMedia();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing media ID" }, { status: 400 });
    }
    const result = await deleteMedia(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete media asset" }, { status: 500 });
  }
}
