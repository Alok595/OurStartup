import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get db stats using mongoose connection
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const stats = await db.stats();
    
    // stats.dataSize is in bytes. Let's return bytes.
    return NextResponse.json({
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      collections: stats.collections,
      objects: stats.objects,
    });
  } catch (error: any) {
    console.error("Storage Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch storage stats" }, { status: 500 });
  }
}
