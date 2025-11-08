import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function MyCart() {
    useRedirectIfNotAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-4xl p-8">
                <CardHeader>
                    <CardTitle>My Cart</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Your cart items will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default MyCart