import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePortfolio } from "@/lib/revalidate";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const erp = searchParams.get("erp") === "true"; // only ERPs
    const work = searchParams.get("work") === "true"; // only items shown on the Work page

    await connectToDatabase();

    const query: Record<string, unknown> = {};
    if (featured) query.featured = true;
    if (erp) query.isErp = true;
    if (work) query.showInWork = { $ne: false };

    // Fetch projects, sorted by newest first
    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/portfolio error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Simple slug generator if not provided
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const project = await Project.create(body);
    revalidatePortfolio();
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
