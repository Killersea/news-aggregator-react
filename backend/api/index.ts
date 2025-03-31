import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const response = await axios.get(url);
    const dom = new JSDOM(response.data, { url });
    const article = new Readability(dom.window.document).parse();

    return res.json({ content: article?.textContent || "No content found" });
  } catch (error) {
    console.error("Error fetching article:", error);
    return res.status(500).json({ error: "Failed to fetch article" });
  }
}
