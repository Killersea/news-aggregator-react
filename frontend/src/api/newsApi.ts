export const fetchSearchResults = async (queryKey: string) => {
	if (!queryKey) return {};

	const response = await fetch(
		`${import.meta.env.VITE_APP_VERCEL_BACKEND_URL}/api/news?type=search&query=${queryKey}`
	);

	if (!response.ok) {
		throw new Error("Failed to fetch search results");
	}

	return response.json();
};

export const fetchArticleContent = async (url: string) => {
	if (!url) return {};

	const response = await fetch(
		`${import.meta.env.VITE_APP_VERCEL_URL}/api/articleContent?url=${url}`,
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
		`${import.meta.env.VITE_APP_VERCEL_BACKEND_URL}/api/news?type=headlines&country=${country}&category=${category}`
	);

	if (!response.ok) {
		throw new Error("Failed to fetch headlines");
	}

	return response.json();
};