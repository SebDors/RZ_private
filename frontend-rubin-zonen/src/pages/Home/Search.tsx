import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Search() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-4xl p-8">
                <CardHeader>
                    <CardTitle>Search</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Search functionality will be here.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Search