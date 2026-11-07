import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import InterestedClient from "@/models/InterestedClient";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    await connectToDatabase();
    const body = await request.json();

    const updatedClient = await InterestedClient.findByIdAndUpdate(
      clientId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error("PATCH Interested Client Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    await connectToDatabase();
    const deletedClient = await InterestedClient.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Interested Client Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

