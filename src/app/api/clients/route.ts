import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Client from "@/models/Client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Fetch all clients, sorted by most recent
    const clients = await Client.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(clients);
  } catch (error: any) {
    console.error("GET Clients Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    
    const { name, phone, dealAmount, paid, startDate, endDate, projectEmail, projectPassword, projectLinks } = body;
    
    if (!name || !phone || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newClient = new Client({
      name,
      phone,
      dealAmount: Number(dealAmount) || 0,
      paid: Number(paid) || 0,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      projectEmail,
      projectPassword,
      projectLinks: Array.isArray(projectLinks) ? projectLinks : [],
    });

    await newClient.save();
    
    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error("POST Client Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
