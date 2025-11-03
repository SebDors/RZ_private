import { Outlet } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function MyAccount() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>My Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Outlet/>
                </CardContent>
            </Card>
        </div>
    )
}

export default MyAccount