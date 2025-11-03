import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api.ts';
import EyeIcon from '../../assets/icons/Eye.tsx';
import EyeOffIcon from '../../assets/icons/EyeOff.tsx';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setErrorFields([]);

        try {
            const data = await loginUser(email, password);

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
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to login.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={errorFields.includes('email') ? 'border-red-500' : ''}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
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
                                    <i onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                        {passwordShown ? <EyeOffIcon /> : <EyeIcon />}
                                    </i>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={() => setRememberMe(!rememberMe)}
                                />
                                <Label htmlFor="rememberMe">Remember me</Label>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button onClick={handleSubmit} className="w-full">Login</Button>
                    <p className="mt-4 text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="underline">
                            Register here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default LogIn;