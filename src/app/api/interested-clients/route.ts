import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import InterestedClient from "@/models/InterestedClient";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const clients = await InterestedClient.find({}).sort({ createdAt: -1 });

    return NextResponse.json(clients, { status: 200 });
  } catch (error: any) {
    console.error("GET Interested Clients Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await request.json();
    const { name, phone, status, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const newClient = await InterestedClient.create({
      name: name.trim(),
      phone: phone.trim(),
      status: status || "Interested",
      notes: notes || "",
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error("POST Interested Client Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

