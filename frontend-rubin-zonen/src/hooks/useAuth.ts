import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken } from './useRedirect';
import type { User } from '@/models/models';
import { toast } from 'sonner';

interface DecodedToken {
    id: number;
    role: string;
    iat: number;
    exp: number;
}

export const useAuth = () => {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
    
        const fetchUser = useCallback(async (userId: number) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData: User = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load user data.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        }, []);
    
        useEffect(() => {
            const token = getToken();
            if (token) {
                try {
                    const decodedToken = jwtDecode<DecodedToken>(token);
                    fetchUser(decodedToken.id);
                } catch (error) {
                    console.error("Failed to decode token:", error);
                    setUser(null);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }, [fetchUser]);

    const updateUser = useCallback(async (userId: number, updatedUserData: Partial<User>) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`,
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user data');
            }

            const data: User = await response.json();
            setUser(data);
            return data;
        } catch (error) {
            console.error("Error updating user data:", error);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success("Logged out successfully.");
    }, []);

    return { user, loading, updateUser, logout };
};
