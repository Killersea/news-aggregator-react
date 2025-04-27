export const fetchSearchResults = async (queryKey: string) => {
	if (!queryKey) return {};

	const response = await fetch(
		`https://newsapi.org/v2/everything?q="${queryKey}"&searchIn=title&languange=en`,
		{
			headers: {
				"X-Api-Key": import.meta.env.VITE_APP_API_KEY as string,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};

export const fetchArticleContent = async (url: string) => {
	if (!url) return {};

	const response = await fetch(
		`http://localhost:5000/api/articles/fetch-article?url=${url}`,
		{}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};

export const fetchHeadlineNews = async (
	country: string = "us",
	category: string = "general"
) => {
	if (!category) return {};

	const response = await fetch(
		`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}`,
		{
			headers: {
				"X-Api-Key": import.meta.env.VITE_APP_API_KEY as string,
			},
		}
	);

	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};
