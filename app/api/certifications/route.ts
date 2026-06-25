import { NextRequest, NextResponse } from "next/server";
import { getCertifications, addCertification } from "@/lib/db";

export async function GET() {
  try {
    const list = await getCertifications();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cert = await req.json();
    if (!cert.title || !cert.issuer) {
      return NextResponse.json({ error: "Title and Issuer are required" }, { status: 400 });
    }
    const created = await addCertification(cert);
    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create certification" }, { status: 500 });
  }
}
