import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AutoCompleteSearchBar from "../components/AutoCompleteSearchBar";
import { ArticleData } from "../interfaces/articleInterface";
import ArticlesSearchResults from "../components/ArticlesSearchResults";

export default function HomePage() {
  const queryClient = new QueryClient();
  const [searchResults, setSearchResults] = useState<ArticleData[]>([]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 flex justify-center">
        <AutoCompleteSearchBar setSearchResults={setSearchResults} />
      </div>

      <div className="min-h-screen flex flex-col items-center mt-4 px-4 md:px-8 lg:px-16">
        {searchResults.length > 0 ? (
          <ArticlesSearchResults searchResults={searchResults} />
        ) : (
          <h1 className="text-2xl font-bold">Welcome to the News App Empty</h1>
        )}
      </div>
    </QueryClientProvider>
  );
}
