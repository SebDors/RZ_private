import Header from "@/components/Header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function Dashboard() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Card className="w-full max-w-4xl p-8">
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Your dashboard content will be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Dashboard