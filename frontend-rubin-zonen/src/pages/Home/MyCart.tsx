import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function MyCart() {
    useRedirectIfNotAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h2 className="text-2xl font-bold mb-4">My Cart</h2>
            <p>My Cart</p>
        </div>
    )
}

export default MyCart