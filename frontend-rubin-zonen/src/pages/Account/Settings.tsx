import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // Assuming a Switch component for toggles
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/models/models';
import { useTheme } from '@/hooks/use-theme.tsx';

function Settings() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(false);
    // Add more notification types as needed

    useEffect(() => {
        if (user) {
            // Assuming user model has notification preferences
            // For now, setting dummy values
            setEmailNotifications(true);
            setSmsNotifications(false);
        }
    }, [user]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("User not logged in.");
            return;
        }

        // TODO: Add fields for notification preferences to User model and use updateUser
        const updatedSettings: Partial<User> = {
            // For now, just logging
        };
        console.log(updatedSettings); // To mark as used

        try {
            // Assuming updateUser can handle partial updates including settings
            // await updateUser(user.id, updatedSettings);
            console.log("Saving settings:", { emailNotifications, smsNotifications });
            toast.success("Settings updated successfully!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to update settings.");
            } else {
                toast.error("An unknown error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSaveChanges} className="space-y-8">
            <div>
                <h2 className="text-xl font-bold mb-4">Theme</h2>
                <div className="flex items-center space-x-2">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>Light</Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>Dark</Button>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>System</Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
                <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                    />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                    />
                </div>
                {/* Add more notification settings here */}
            </div>

            <Button type="submit" className="mt-4">Save Preferences</Button>
        </form>
    );
}

export default Settings;