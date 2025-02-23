import mongoose from "mongoose";

// Use globalThis to store connection across hot reloads (in development)
let cached = (global as any).mongoose || { conn: null, promise: null };

export const createMongoConnection = async () => {
  if (cached.conn) {
    console.log("Using existing mongoDB database connection");
    return;
  }

  if (!cached.promise) {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    cached.promise = mongoose.connect(MONGO_URI);
  }

  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  console.log("MongoDB Connected Successfully");
};
