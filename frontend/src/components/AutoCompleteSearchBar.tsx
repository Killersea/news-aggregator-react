import { useEffect, useState, useMemo, useRef } from "react";
import {
	TextField,
	Autocomplete,
	createFilterOptions,
	Box,
	Typography,
} from "@mui/material";
import { useSearchNews } from "../hooks/newsHooks";
import { ArticleData } from "../interfaces/articleInterface";

interface AutoCompleteSearchBarProps {
	setSearchResults: (results: ArticleData[]) => void;
}

export default function AutoCompleteSearchBar({
	setSearchResults,
}: AutoCompleteSearchBarProps) {
	const hint = useRef("");
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, 1000);

		return () => clearTimeout(handler);
	}, [inputValue]);

	const { data, error, isLoading } = useSearchNews(debouncedValue);

	const searchResult = useMemo(() => {
		if (isLoading || error || !data || !data.articles) return [];

		const uniqueTitles = new Map();

		return data.articles
			.filter(
				({ description, content, title }: ArticleData) =>
					description && content && title
			)
			.filter(({ title }: ArticleData) => {
				if (uniqueTitles.has(title)) return false;
				uniqueTitles.set(title, true);
				return true;
			})
			.map(
				({
					author,
					title,
					description,
					url,
					urlToImage,
					publishedAt,
					content,
				}: ArticleData) => ({
					author,
					title,
					description,
					url,
					urlToImage,
					publishedAt,
					content,
				})
			);
	}, [data, isLoading, error]);

	const articleTitleOptions = searchResult.map(({ title }: ArticleData) => ({
		title,
	}));

	useEffect(() => {
		const filteredResults = searchResult.filter(({ title }: ArticleData) =>
			inputValue
				? title.toLowerCase().startsWith(inputValue.toLowerCase())
				: true
		);
		if (filteredResults.length > 0) {
			setSearchResults(filteredResults);
			const handler = setTimeout(() => {}, 1000);
			return () => clearTimeout(handler);
		} else {
			const handler = setTimeout(() => {
				setSearchResults([]);
			}, 1000);
			return () => clearTimeout(handler);
		}
	}, [searchResult]);

	const filterOptions = useMemo(
		() =>
			createFilterOptions({
				matchFrom: "start",
				stringify: ({ title }: ArticleData) => title ?? "",
			}),
		[]
	);

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
			options={articleTitleOptions}
			sx={{ width: "75%" }}
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
							const matchingOption = articleTitleOptions.find(
								({ title }: ArticleData) => title.startsWith(newValue)
							);

							hint.current =
								newValue && matchingOption ? matchingOption.title : "";
						}}
						label="Movie"
						fullWidth
					/>
				</Box>
			)}
		/>
	);
}
