import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRedirectIfAuth } from "@/hooks/useRedirect";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";
import logo from '@/assets/logos/logo blanc front BLEU_page-0001.jpg';

function ForgottenPassword() {
    useRedirectIfAuth();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await forgotPassword(email);
            toast.success(data.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <img src={logo} alt="Company Logo" className="mb-8 h-24" />
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a link to reset your
                        password.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5 mb-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full">
                            Send reset link
                        </Button>
                        <p className="mt-4 text-center text-sm">
                            <Link to="/login" className="underline">
                                Back to login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default ForgottenPassword;