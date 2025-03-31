import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function fetchArticleContent(
	articleUrl: string
): Promise<string | null> {
	try {
		// Fetch the article HTML
		const response = await axios.get(articleUrl);

		// Convert to a DOM object using jsdom
		const dom = new JSDOM(response.data, { url: articleUrl });

		// Parse the article content using Readability
		const article = new Readability(dom.window.document).parse();

		// Return the parsed article text
		return article?.textContent || null;
	} catch (error) {
		console.error("Error fetching article content:", error);
		return null;
	}
}
