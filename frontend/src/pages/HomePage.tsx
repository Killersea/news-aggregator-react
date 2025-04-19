import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import AutoCompleteSearchBar from "../components/AutoCompleteSearchBar";
import { ArticleData } from "../interfaces/articleInterface";
import ArticlesSearchResults from "../components/ArticlesSearchResults";
import HeadlinesPage from "./HeadlinesPage";
import { queryClient } from "../queryClient.ts";

export default function HomePage() {
	const [searchResults, setSearchResults] = useState<ArticleData[]>([]);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="sticky top-0 bg-white z-10 shadow-md p-4 flex justify-center">
				<AutoCompleteSearchBar setSearchResults={setSearchResults} />
			</div>

			<div
				className={`flex flex-col items-center mt-4 px-4 md:px-8 lg:px-16 ${
					searchResults.length > 0 ? "block" : "hidden"
				}`}
			>
				<ArticlesSearchResults searchResults={searchResults} />
			</div>
			<div
				className={`flex flex-col items-center mt-4 px-4 md:px-8 lg:px-16 ${
					searchResults.length > 0 ? "hidden" : "block"
				}`}
			>
				<HeadlinesPage />
			</div>
		</QueryClientProvider>
	);
}
