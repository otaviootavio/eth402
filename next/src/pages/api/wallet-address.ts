import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const response = await axios.get("http://localhost:4000/address");
      res.status(200).json({ address: response.data });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet address" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
