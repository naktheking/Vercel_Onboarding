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
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, person } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  const doc = await Message.create({
    message,
    person: person?.trim() ? person : "Unknown",
  });

  return res.status(200).json(doc);
}
