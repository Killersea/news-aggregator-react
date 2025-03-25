export const fetchSearchResults = async (queryKey: string) => {
	if (!queryKey) return {};

	const response = await fetch(
		`https://newsapi.org/v2/everything?q="${queryKey}"`,
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