import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/models/models';
import { toast } from 'sonner';

function Profile() {
    const { user, updateUser } = useAuth();

    const [prefix, setPrefix] = useState(user?.prefix || '');
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [email, setEmail] = useState(user?.email || '');
    const [designation, setDesignation] = useState(user?.designation || '');
    const [seller, setSeller] = useState(user?.seller || '');
    const [companyName, setCompanyName] = useState(user?.company_name || '');
    const [ownerName, setOwnerName] = useState(user?.company_owner || '');
    const [companyType, setCompanyType] = useState(user?.company_type || '');
    const [companyEmail, setCompanyEmail] = useState(user?.company_email || '');
    const [companyAddress, setCompanyAddress] = useState(user?.company_address || '');
    const [companyWebsite, setCompanyWebsite] = useState(''); // user?.company_website || '' - missing in User model
    const [city, setCity] = useState(user?.company_city || '');
    const [country, setCountry] = useState(user?.company_country || '');
    const [postalCode, setPostalCode] = useState(user?.company_zip_code || '');
    const [howDidYouHear, setHowDidYouHear] = useState(user?.how_found_us || '');

    useEffect(() => {
        if (user) {
            setPrefix(user.prefix || '');
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            setPhoneNumber(user.phone_number || '');
            setEmail(user.email || '');
            setDesignation(user.designation || '');
            setSeller(user.seller || '');
            setCompanyName(user.company_name || '');
            setOwnerName(user.company_owner || '');
            setCompanyType(user.company_type || '');
            setCompanyEmail(user.company_email || '');
            setCompanyAddress(user.company_address || '');
            // setCompanyWebsite(user.company_website || ''); // missing in User model
            setCity(user.company_city || '');
            setCountry(user.company_country || '');
            setPostalCode(user.company_zip_code || '');
            setHowDidYouHear(user.how_found_us || '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("User not logged in.");
            return;
        }

        const updatedUserData: Partial<User> = {
            prefix,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email,
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
            // company_website: companyWebsite, // missing in User model
            how_found_us: howDidYouHear,
        };

        try {
            // Assuming updateUser function exists in useAuth hook and handles API call
            await updateUser(user.id, updatedUserData);
            toast.success("Profile updated successfully!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update profile.");
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="prefix">Prefix</Label>
                    <Select onValueChange={setPrefix} value={prefix}>
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
                    <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="designation">Designation</Label>
                    <Select onValueChange={setDesignation} value={designation}>
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
                    <Select onValueChange={setSeller} value={seller}>
                        <SelectTrigger id="seller">
                            <SelectValue placeholder="Select a seller" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="seller1">Seller 1</SelectItem>
                            <SelectItem value="seller2">Seller 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 mt-6">Company Information</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input id="ownerName" type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Input id="companyType" type="text" value={companyType} onChange={(e) => setCompanyType(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input id="companyEmail" type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Input id="companyAddress" type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input id="companyWebsite" type="url" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
            </div>

            <h2 className="text-xl font-bold mb-4 mt-6">Other Information</h2>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                <Input id="howDidYouHear" type="text" value={howDidYouHear} onChange={(e) => setHowDidYouHear(e.target.value)} />
            </div>

            <Button type="submit" className="mt-4">Update Profile</Button>
        </form>
    );
}

export default Profile;