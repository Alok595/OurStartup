import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

let cachedStats: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = Date.now();
    if (cachedStats && (now - cachedStats.timestamp < CACHE_TTL_MS)) {
      return NextResponse.json(cachedStats.data);
    }

    await connectToDatabase();
    
    // Get db stats using mongoose connection
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const stats = await db.stats();
    
    const result = {
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      collections: stats.collections,
      objects: stats.objects,
    };

    cachedStats = {
      data: result,
      timestamp: now,
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Storage Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch storage stats" }, { status: 500 });
  }
}
