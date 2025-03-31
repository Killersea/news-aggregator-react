import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { type, query, country, category } = req.query;
	const API_KEY = process.env.NEWS_API_KEY;

    res.setHeader("Access-Control-Allow-Origin", "https://news-aggregator-react-nine.vercel.app"); // Change to your frontend URL
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

	if (!API_KEY) {
		return res.status(500).json({ error: "Missing API key" });
	}

	let url = "";

	if (type === "search") {
		if (!query) return res.status(400).json({ error: "Query is required" });

		url = `https://newsapi.org/v2/everything?q=${query}&searchIn=title&language=en`;
	} else if (type === "headlines") {
		url = `https://newsapi.org/v2/top-headlines?country=${country || "us"}&category=${category || "general"}`;
	} else {
		return res.status(400).json({ error: "Invalid request type" });
	}

	try {
		const response = await axios.get(url, {
			headers: { "X-Api-Key": API_KEY },
		});

		return res.status(200).json(response.data);
	} catch (error: any) {
		console.error("Error fetching news:", error.message);
		return res.status(500).json({ error: "Failed to fetch news" });
	}
}
