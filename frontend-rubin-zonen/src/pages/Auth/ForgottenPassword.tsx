import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, Navigate } from "react-router-dom"

function ForgottenPassword() {
  const token = localStorage.getItem('token'); // If token is valid can't access page
  if (token) {return <Navigate to="/dashboard" />;} //TODO check validity not just existence

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>Enter your email address and we will send you a link to reset your password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="email@example.com" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button className="w-full">Send reset link</Button>
                    <p className="mt-4 text-center text-sm">
                        <Link to="/login" className="underline">
                            Back to login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ForgottenPassword