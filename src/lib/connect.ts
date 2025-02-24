import mongoose from "mongoose";

// Define a proper type for cached connection
type CachedConnection = {
  conn: typeof mongoose | null; // Change type to 'typeof mongoose'
  promise: Promise<typeof mongoose> | null;
};

// Use `const` since `cached` is not reassigned
const cached: CachedConnection = (globalThis as any).mongoose || { conn: null, promise: null };

export const createMongoConnection = async (): Promise<void> => {
  if (cached.conn) {
    console.log("Using existing MongoDB database connection");
    return;
  }

  if (!cached.promise) {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }

    // Assign the promise to cached
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise; // Assign the resolved mongoose instance
  (globalThis as any).mongoose = cached;
  console.log("MongoDB Connected Successfully");
};
