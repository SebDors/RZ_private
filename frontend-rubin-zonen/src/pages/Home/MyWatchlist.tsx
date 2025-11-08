import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function MyWatchlist() {
    useRedirectIfNotAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>

        </div>
    )
}

export default MyWatchlist