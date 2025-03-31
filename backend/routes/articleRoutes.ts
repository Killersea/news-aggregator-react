import express, { Request, Response } from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const router = express.Router();

router.get("/fetch-article", async (req: Request, res: Response) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    const response = await axios.get(url);
    const dom = new JSDOM(response.data, { url });
    const article = new Readability(dom.window.document).parse();

    res.json({ content: article?.textContent || "No content found" });
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

export default router;
