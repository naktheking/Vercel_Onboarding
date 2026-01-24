import mongoose from "mongoose";
import Message from "../models/Message.js";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    await connectDB();
    const docs = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json(docs);
  } catch (err) {
    console.error("getMessage error:", err);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
}

