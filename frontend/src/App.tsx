import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AutoCompleteSearchBar from "./components/AutocompleteSearchBar";
import { TextField } from "@mui/material";

function App() {
	const queryClient = new QueryClient();

	return (
		<>
			<div>
				<QueryClientProvider client={queryClient}>
					<AutoCompleteSearchBar />
					<TextField />
				</QueryClientProvider>
			</div>
		</>
	);
}

export default App;
