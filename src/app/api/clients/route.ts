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
    const clients = await Client.find({}).sort({ createdAt: -1 }).lean();
    
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
    
    const { 
      name, 
      phone, 
      dealAmount, 
      paid, 
      startDate, 
      endDate, 
      projectEmail, 
      projectPassword, 
      projectCredentials, 
      projectLinks 
    } = body;
    
    if (!name || !phone || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize credentials array
    const credentialsList = Array.isArray(projectCredentials) 
      ? projectCredentials.filter((c: any) => c && (c.email?.trim() || c.password?.trim() || c.title?.trim()))
      : [];

    if (credentialsList.length === 0 && (projectEmail || projectPassword)) {
      credentialsList.push({
        title: "Primary",
        email: projectEmail || "",
        password: projectPassword || ""
      });
    }

    const firstCred = credentialsList[0] || {};

    const newClient = new Client({
      name,
      phone,
      dealAmount: Number(dealAmount) || 0,
      paid: Number(paid) || 0,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      projectEmail: firstCred.email || projectEmail || "",
      projectPassword: firstCred.password || projectPassword || "",
      projectCredentials: credentialsList,
      projectLinks: Array.isArray(projectLinks) ? projectLinks : [],
    });

    await newClient.save();
    
    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error("POST Client Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
