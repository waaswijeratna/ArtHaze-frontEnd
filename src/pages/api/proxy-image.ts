/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing image URL" });
  }

  try {
    // Fetch image from Firebase
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch image" });
    }

    // Set proper headers to avoid CORS issues
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Stream image data back
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
