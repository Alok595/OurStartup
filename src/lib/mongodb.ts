import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  let MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;

  if (!MONGODB_URL) {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn("Notice: MONGODB_URL / MONGODB_URI is not configured during static build. Database queries will execute dynamically at runtime.");
      return mongoose;
    }
    console.error("CRITICAL: MONGODB_URL / MONGODB_URI is not defined in environment variables!");
    throw new Error(
      "Please define the MONGODB_URL or MONGODB_URI environment variable in your deployment platform settings (e.g. Vercel) or .env.local"
    );
  }

  // Clean up any leading/trailing quotes or whitespace if accidentally pasted into deployment settings
  MONGODB_URL = MONGODB_URL.trim().replace(/^["']|["']$/g, "").trim();

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      console.log("Successfully connected to MongoDB.");
      return mongoose;
    }).catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
