import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox"
import EyeIcon from "@/assets/icons/Eye";
import EyeOffIcon from "@/assets/icons/EyeOff";
import { loginUser } from "@/services/Auth";

export function LogIn() {
  const token = localStorage.getItem('token'); // If token is valid can't access page
  if (token) {return <Navigate to="/dashboard" />;} //TODO check validity not just existence

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setErrorFields([]);

      try {
          const data: any = await loginUser(email, password);

          if (data.token) {
              if (rememberMe) {
                  localStorage.setItem('token', data.token); // Store token in localStorage for persistent login
              } else {
                  sessionStorage.setItem('token', data.token);// Store token in sessionStorage for session-only login
              }
              navigate('/dashboard');
          } else {
              setError(data.message || 'Login failed. Please check your credentials.');
              if (data.message === 'User not found' || data.message === 'Invalid credentials') {
                  setErrorFields(['email', 'password']);
              }
          }
      } catch (err) {
          setError('An error occurred during login.');
      }
  };

  const togglePasswordVisibility = () => {
      setPasswordShown(!passwordShown);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <Card className="w-[350px] mx-auto my-6">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="grid w-full items-center gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errorFields.includes('email') ? 'border-red-500' : ''}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgotten-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={passwordShown ? "text" : "password"} 
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={errorFields.includes('password') ? 'border-red-500' : ''}
                />
                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                    {passwordShown ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex items-start w-full gap-2 mb-1">
          <Checkbox 
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked: boolean) => setRememberMe(checked)}
          />
          <Label htmlFor="rememberMe">Remember me</Label>
        </div>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Login
        </Button>
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
    </div>
  )
}

export default LogIn;