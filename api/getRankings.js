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

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseNames(text) {
  const raw = String(text || "")
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Set();
  const out = [];
  for (const name of raw) {
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET allowed" });
  }

  try {
    await connectDB();

    const names = parseNames(process.env.RANKING_NAMES);
    if (names.length === 0) {
      return res.status(400).json({
        error:
          "RANKING_NAMES is not set. Add it as an environment variable (comma/newline separated names).",
      });
    }

    const docs = await Message.find({}, { message: 1, person: 1, createdAt: 1 });

    const counts = names.map((name) => {
      const re = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
      let count = 0;
      for (const msg of docs) {
        const hay = `${msg?.person ?? ""} ${msg?.message ?? ""}`;
        if (re.test(hay)) count += 1;
      }
      return { name, count };
    });

    counts.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return res.status(200).json(counts);
  } catch (err) {
    console.error("getRankings error:", err);
    return res.status(500).json({ error: "Failed to build rankings" });
  }
}

