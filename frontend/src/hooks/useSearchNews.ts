import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "../api/newsApi";

export const useSearchNews = (query: string) => {
	return useQuery({
		queryKey: ["search", query],
		queryFn: () => fetchSearchResults(query),
		enabled: query.trim().length > 2, // Fetch only if >2 chars
		refetchOnWindowFocus: false,
		staleTime: 500, // Debounce effect
	});
};