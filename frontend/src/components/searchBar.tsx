import * as React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

const fetchSearchResults = async (queryKey: string) => {
	console.log("hello");
	if (!queryKey) return {};
	console.log("hello2");
	console.log(queryKey);
	const response = await fetch(
		`https://newsapi.org/v2/everything?q="${queryKey}"`,
		{
			headers: {
				"X-Api-Key": import.meta.env.VITE_APP_API_KEY as string,
			},
		}
	);
	console.log("hello3");
	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};

export default function AutocompleteHint() {
	const hint = React.useRef("");
	const [inputValue, setInputValue] = React.useState("");
	const [debouncedValue, setDebouncedValue] = useState("");

	// Debounce Effect: Wait 2 seconds before updating debouncedValue
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, 2000); // 2-second delay

		return () => clearTimeout(handler); // Cleanup previous timeout
	}, [inputValue]);

	// Fetch data using useQuery
	const { data, error, isLoading } = useQuery({
		queryKey: ["search", debouncedValue],
		queryFn: () => fetchSearchResults(inputValue),
		enabled: inputValue.trim().length > 2, // Fetch only if >2 chars
		refetchOnWindowFocus: false,
		staleTime: 500, // Debounce effect
	});

	const searchResult = useMemo(() => {
		console.log("data", import.meta.env.VITE_APP_API_KEY);
		if (isLoading || error || !data || !data.articles) return [];
		return data.articles.map((article: { title: string }) => ({
			title: article.title,
		}));
	}, [data, isLoading, error]);

	const filterOptions = createFilterOptions({
		matchFrom: "start",
		stringify: (option: getTitlesType) => option.title,
	});

	interface getTitlesType {
		title: string;
	}

	return (
		<Autocomplete
			onKeyDown={(event) => {
				if (event.key === "Tab") {
					if (hint.current) {
						setInputValue(hint.current);
						event.preventDefault();
					}
				}
			}}
			filterOptions={filterOptions}
			onClose={() => {
				hint.current = "";
			}}
			onChange={(_, newValue) => {
				setInputValue(newValue && newValue.title ? newValue.title : "");
			}}
			disablePortal
			inputValue={inputValue}
			id="combo-box-hint-demo"
			options={searchResult}
			sx={{ width: 300 }}
			getOptionLabel={(option) => option.title || ""}
			renderInput={(params) => {
				return (
					<Box
						textAlign="left"
						sx={{ position: "relative", padding: 0 }}
					>
						<Typography
							sx={{
								position: "absolute",
								opacity: 0.5,
								left: 14,
								top: 16,
								overflow: "hidden",
								whiteSpace: "nowrap",
								width: "calc(100%)", // Adjust based on padding of TextField
							}}
						>
							{hint.current}
						</Typography>
						<TextField
							{...params}
							onChange={(event) => {
								const newValue = event.target.value;
								setInputValue(newValue);
								const matchingOption = searchResult.find(
									(option: any) =>
										option.title.startsWith(newValue)
								);

								if (newValue && matchingOption) {
									hint.current = matchingOption.title;
								} else {
									hint.current = "";
								}
							}}
							label="Movie"
							fullWidth={true}
						/>
					</Box>
				);
			}}
		/>
	);
}
