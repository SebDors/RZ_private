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

import type { User } from '@/models/models';
import { registerUser } from '@/services/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

    type SubmitEvent = React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>;

    const handleSubmit = async (e?: SubmitEvent): Promise<void> => {
        if (e) e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!acceptTerms) {
            toast.error("You must accept the terms and conditions!");
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
            const response = await registerUser(userData as User);
            toast.success(response.message);
            navigate('/login');
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "An error occurred during registration.");
            } else {
                toast.error("An unknown error occurred during registration.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="prefix">Prefix</Label>
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
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="Your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="Your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
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

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="designation">Designation</Label>
                                <Select onValueChange={setDesignation} value={designation} required>
                                    <SelectTrigger id="designation">
                                        <SelectValue placeholder="Select your designation" />
                                    </SelectTrigger>
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
                                <Label htmlFor="seller">Seller</Label>
                                <Select onValueChange={setSeller} value={seller} required>
                                    <SelectTrigger id="seller">
                                        <SelectValue placeholder="Select a seller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="seller1">Seller 1</SelectItem>
                                        <SelectItem value="seller2">Seller 2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    type="text"
                                    placeholder="Your company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="ownerName">Owner Name</Label>
                                <Input
                                    id="ownerName"
                                    type="text"
                                    placeholder="Owner's name"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyType">Company Type</Label>
                                <Input
                                    id="companyType"
                                    type="text"
                                    placeholder="Type of company"
                                    value={companyType}
                                    onChange={(e) => setCompanyType(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyEmail">Company Email</Label>
                                <Input
                                    id="companyEmail"
                                    type="email"
                                    placeholder="company@example.com"
                                    value={companyEmail}
                                    onChange={(e) => setCompanyEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyAddress">Company Address</Label>
                                <Input
                                    id="companyAddress"
                                    type="text"
                                    placeholder="Company address"
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="companyWebsite">Company Website</Label>
                                <Input
                                    id="companyWebsite"
                                    type="url"
                                    placeholder="Company website"
                                    value={companyWebsite}
                                    onChange={(e) => setCompanyWebsite(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    type="text"
                                    placeholder="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    type="text"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="idDocument">ID Document (Optional)</Label>
                                <Input
                                    id="idDocument"
                                    type="file"
                                    onChange={(e) => setIdDocument(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="businessLicense">Business License (Optional)</Label>
                                <Input
                                    id="businessLicense"
                                    type="file"
                                    onChange={(e) => setBusinessLicense(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                                <Input
                                    id="howDidYouHear"
                                    type="text"
                                    placeholder="e.g., Google, Friend, etc."
                                    value={howDidYouHear}
                                    onChange={(e) => setHowDidYouHear(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    required
                                />
                                <Label htmlFor="acceptTerms">I accept the terms and conditions</Label>
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