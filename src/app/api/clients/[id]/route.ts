import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Client from "@/models/Client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    await connectToDatabase();
    const body = await request.json();
    
    // Calculate new due amount if dealAmount or paid is updated
    if (body.dealAmount !== undefined || body.paid !== undefined) {
      const existingClient = await Client.findById(clientId);
      if (!existingClient) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
      
      const newDealAmount = body.dealAmount !== undefined ? Number(body.dealAmount) : existingClient.dealAmount;
      const newPaid = body.paid !== undefined ? Number(body.paid) : existingClient.paid;
      
      body.due = newDealAmount - newPaid;
    }

    if (Array.isArray(body.projectCredentials)) {
      const filtered = body.projectCredentials.filter(
        (c: any) => c && (c.email?.trim() || c.password?.trim() || c.title?.trim())
      );
      body.projectCredentials = filtered;
      if (filtered.length > 0) {
        body.projectEmail = filtered[0].email || "";
        body.projectPassword = filtered[0].password || "";
      }
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(updatedClient);
  } catch (error: any) {
    console.error("PATCH Client Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    await connectToDatabase();
    const deletedClient = await Client.findByIdAndDelete(clientId);

    if (!deletedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error: any) {
    console.error("DELETE Client Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
