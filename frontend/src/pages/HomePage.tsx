import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import AutoCompleteSearchBar from "../components/AutoCompleteSearchBar";
import { ArticleData } from "../interfaces/articleInterface";
import ArticlesSearchResults from "../components/ArticlesSearchResults";
import HeadlinesPage from "./HeadlinesPage";
import { queryClient } from "../queryClient.ts";
import Clock from "../components/Clock";
import newsAPILogo from "../assets/newsAPILogo.png";
import { Menu } from "@mui/icons-material";
import { Button } from "@mui/material";
import SwipeableTemporaryDrawer from "../components/SwipeableTemporaryDrawer";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<ArticleData[]>([]);
  const [inputValue, setInputValue] = useState(() => {
    return localStorage.getItem("searchInput") || "";
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleLogoClick = () => {
    setInputValue("");
    setSearchResults([]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="sticky top-0 bg-white z-10 shadow-md p-4 flex items-center px-8">
        <div
          className="hidden md:flex items-center justify-start w-[250px] h-full cursor-pointer"
          onClick={handleLogoClick}
        >
          <img src={newsAPILogo} alt="Logo" />
        </div>

        <div className="flex-grow flex justify-center">
          <AutoCompleteSearchBar
            setSearchResults={setSearchResults}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </div>

        <div className="flex items-center justify-end text-sm text-gray-600 h-full w-[10%] md:w-[250px]">
          <div className="hidden md:block">
            <Clock />
          </div>
          <Button
            sx={{ minWidth: "auto", marginLeft: { xs: "0", md: "10px" } }}
            onClick={() => setOpenDrawer(true)}
          >
            <Menu sx={{ fontSize: { xs: 24, md: 32 } }} />
          </Button>
        </div>
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
      <SwipeableTemporaryDrawer
        opendrawer={openDrawer}
        setOpendrawer={setOpenDrawer}
      />
    </QueryClientProvider>
  );
}
