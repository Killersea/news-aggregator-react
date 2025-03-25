import { useEffect, useState, useMemo, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSearchNews } from "../hooks/useSearchNews";

interface getTitlesType {
	title: string;
}

export default function AutoCompleteSearchBar() {
	const hint = useRef("");
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");

	// Debounce Effect: Wait 2 seconds before updating debouncedValue
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, 2000); // 2-second delay

		return () => clearTimeout(handler); // Cleanup previous timeout
	}, [inputValue]);

	// Fetch data using custom hook
	const { data, error, isLoading } = useSearchNews(debouncedValue);

	const searchResult = useMemo(() => {
		if (isLoading || error || !data || !data.articles) return [];
		return data.articles.map((article: { title: string }) => ({
			title: article.title,
		}));
	}, [data, isLoading, error]);

	const filterOptions = createFilterOptions({
		matchFrom: "start",
		stringify: (option: getTitlesType) => option.title,
	});

	return (
		<Autocomplete
			onKeyDown={(event) => {
				if (event.key === "Tab" && hint.current) {
					setInputValue(hint.current);
					event.preventDefault();
				}
			}}
			filterOptions={filterOptions}
			onClose={() => {
				hint.current = "";
			}}
			onChange={(_, newValue) => {
				setInputValue(newValue?.title || "");
			}}
			disablePortal
			inputValue={inputValue}
			id="combo-box-hint-demo"
			options={searchResult}
			sx={{ width: 300 }}
			getOptionLabel={(option) => option.title || ""}
			renderInput={(params) => (
				<Box textAlign="left" sx={{ position: "relative", padding: 0 }}>
					<Typography
						sx={{
							position: "absolute",
							opacity: 0.5,
							left: 14,
							top: 16,
							overflow: "hidden",
							whiteSpace: "nowrap",
							width: "calc(100%)",
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
								(option: getTitlesType) =>
									option.title.startsWith(newValue)
							);

							hint.current =
								newValue && matchingOption
									? matchingOption.title
									: "";
						}}
						label="Movie"
						fullWidth
					/>
				</Box>
			)}
		/>
	);
}
