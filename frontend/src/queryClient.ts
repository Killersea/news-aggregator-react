// queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Setup localStorage
const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage,
});

// Create the QueryClient
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
});

// Hook up persistence
persistQueryClient({
	queryClient,
	persister: localStoragePersister,
	maxAge: 1000 * 60 * 60, // 1 hour
});
