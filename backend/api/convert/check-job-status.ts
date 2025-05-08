import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://news-aggregator-react-nine.vercel.app"
  ); // Change to your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { jobId } = req.query;
  const API_KEY = process.env.API2CONVERT_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const response = await axios.get(
      `https://api.api2convert.com/v2/jobs/${jobId}`,
      {
        headers: {
          "x-oc-api-key": process.env.API2CONVERT_API_KEY || "",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error checking job status:", error.message);
    return res.status(500).json({ error: "Failed to check job status" });
  }
}
