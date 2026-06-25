import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { addMedia } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate clean unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${cleanName}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    const mediaMeta = {
      name: originalName,
      url: fileUrl,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    const saved = await addMedia(mediaMeta);
    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
