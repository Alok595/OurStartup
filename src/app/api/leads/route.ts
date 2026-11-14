import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

// Public route to submit a new lead
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, types, budget, timeline, details } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    await connectToDatabase();

    const newLead = await Lead.create({
      name,
      email,
      types: types || [],
      budget: budget || "",
      timeline: timeline || "",
      details: details || "",
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Protected route to fetch all leads for the admin dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch leads, sorted by newest first
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
