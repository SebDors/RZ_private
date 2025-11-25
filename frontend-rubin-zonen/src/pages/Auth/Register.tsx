import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRedirectIfAuth } from '@/hooks/useRedirect';
import {
    Eye,
    EyeOffIcon
} from "lucide-react"

import type { User } from '@/models/models';
import { registerUser, loginUser } from '@/services/auth';
// import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logos/logo blanc front BLEU_page-0001.jpg';

function Register() {
    useRedirectIfAuth();
    const navigate = useNavigate();

    const [prefix, setPrefix] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [designation, setDesignation] = useState('');
    const [seller, setSeller] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [companyType, setCompanyType] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [idDocument, setIdDocument] = useState<File | null>(null);
    const [businessLicense, setBusinessLicense] = useState<File | null>(null);
    const [howDidYouHear, setHowDidYouHear] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [passwordShown, setPasswordShown] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    type SubmitEvent = React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>;

    const handleSubmit = async (e?: SubmitEvent): Promise<void> => {
        if (e) e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (!acceptTerms) {
            setError("You must accept the terms and conditions!");
            return;
        }

        const userData: Omit<User, 'id' | 'is_admin' | 'is_active' | 'created_at' | 'updated_at'> = {
            prefix,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email,
            password,
            designation,
            seller,
            company_name: companyName,
            company_owner: ownerName,
            company_type: companyType,
            company_email: companyEmail,
            company_address: companyAddress,
            company_city: city,
            company_country: country,
            company_zip_code: postalCode,
            id_document_url: '', // File upload to be handled later
            business_registration_url: '', // File upload to be handled later
            how_found_us: howDidYouHear,
            accept_terms: acceptTerms,
        };

        // TODO: File upload to be handled later
        console.log(idDocument, businessLicense);

        try {
            await registerUser(userData as User);

            const loginData = await loginUser(email, password);

            if (loginData.token) {
                sessionStorage.setItem('token', loginData.token);
                navigate('/dashboard');
            } else {
                setError(loginData.message || 'Registration successful, but automatic login failed. Please try logging in manually.');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "An error occurred during registration.");
            } else {
                setError("An unknown error occurred during registration.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <img src={logo} alt="Company Logo" className="mb-8 h-24" />
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="prefix">Prefix <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setPrefix} value={prefix} required>
                                    <SelectTrigger id="prefix">
                                        <SelectValue placeholder="Select a prefix" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Mr">Mr.</SelectItem>
                                        <SelectItem value="Mrs">Mrs.</SelectItem>
                                        <SelectItem value="Ms">Ms.</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                    <Input id="firstName" type="text" placeholder="Your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                    <Input id="lastName" type="text" placeholder="Your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phoneNumber">Phone Number <span className="text-red-500">*</span></Label>
                                <Input id="phoneNumber" type="tel" placeholder="Your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={passwordShown ? "text" : "password"}
                                        placeholder="Your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                        {passwordShown ? <EyeOffIcon /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={passwordShown ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                                        {passwordShown ? <EyeOffIcon /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setDesignation} value={designation} required>
                                    <SelectTrigger id="designation"><SelectValue placeholder="Select your designation" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="buyer">Buyer</SelectItem>
                                        <SelectItem value="director">Director</SelectItem>
                                        <SelectItem value="partner">Partner</SelectItem>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="seller">Seller <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setSeller} value={seller} required>
                                    <SelectTrigger id="seller"><SelectValue placeholder="Select a seller" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="seller1">Seller 1</SelectItem>
                                        <SelectItem value="seller2">Seller 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                                    <Input id="companyName" type="text" placeholder="Your company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="ownerName">Owner Name <span className="text-red-500">*</span></Label>
                                    <Input id="ownerName" type="text" placeholder="Owner's name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="companyType">Company Type <span className="text-red-500">*</span></Label>
                                    <Input id="companyType" type="text" placeholder="Type of company" value={companyType} onChange={(e) => setCompanyType(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="companyEmail">Company Email <span className="text-red-500">*</span></Label>
                                    <Input id="companyEmail" type="email" placeholder="company@example.com" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="companyAddress">Company Address <span className="text-red-500">*</span></Label>
                                <Input id="companyAddress" type="text" placeholder="Company address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} required />
                            </div>
                             <div className="md:col-span-2">
                                <Label htmlFor="companyWebsite">Company Website</Label>
                                <Input id="companyWebsite" type="text" placeholder="Company website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                                    <Input id="city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                                    <Input id="country" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                                    <Input id="postalCode" type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                                </div>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="idDocument">ID Document (Optional)</Label>
                                    <Input id="idDocument" type="file" onChange={(e) => setIdDocument(e.target.files ? e.target.files[0] : null)} />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="businessLicense">Business License (Optional)</Label>
                                    <Input id="businessLicense" type="file" onChange={(e) => setBusinessLicense(e.target.files ? e.target.files[0] : null)} />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="howDidYouHear">How did you hear about us? <span className="text-red-500">*</span></Label>
                                <Input id="howDidYouHear" type="text" placeholder="e.g., Google, Friend, etc." value={howDidYouHear} onChange={(e) => setHowDidYouHear(e.target.value)} required />
                            </div>
                            <div className="md:col-span-2 flex items-center space-x-2">
                                <input type="checkbox" id="acceptTerms" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
                                <Label htmlFor="acceptTerms">I accept the terms and conditions <span className="text-red-500">*</span></Label>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button onClick={handleSubmit} className="w-full">Register</Button>
                    <p className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="underline">
                            Login here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Register;