import { useQuery } from "@tanstack/react-query";
import {
	fetchSearchResults,
	fetchArticleContent,
	fetchHeadlineNews,
} from "../api/newsApi";

export const useSearchNews = (query: string) => {
	return useQuery({
		queryKey: ["search", query],
		queryFn: () => fetchSearchResults(query),
		enabled: query.trim().length > 2, // Fetch only if >2 chars
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 30, // 30 minutes
	});
};

export const useArticleContent = (aritlceUrl: string) => {
	return useQuery({
		queryKey: ["content", aritlceUrl],
		queryFn: () => fetchArticleContent(aritlceUrl),
		staleTime: 1000 * 60 * 30, // 30 minutes
	});
};

export const useHeadlineNews = (
	country: string = "us",
	category: string = "general"
) => {
	return useQuery({
		queryKey: ["headline", category],
		queryFn: () => fetchHeadlineNews(country, category),
		staleTime: 1000 * 60 * 30, // 30 minutes
	});
};
