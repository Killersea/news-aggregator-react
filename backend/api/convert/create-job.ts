import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { category, target } = req.body;
  const API_KEY = process.env.API2CONVERT_API_KEY;

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const response = await axios.post(
      "https://api.api2convert.com/v2/jobs",
      {
        conversion: [
          {
            category,
            target,
          },
        ],
      },
      {
        headers: {
          "x-oc-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Create job error:", error.message);
    return res.status(500).json({ error: "Failed to create job" });
  }
}
