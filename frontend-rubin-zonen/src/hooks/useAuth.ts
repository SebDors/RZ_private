import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken } from './useRedirect';

interface DecodedToken {
    id: number;
    role: string;
    iat: number;
    exp: number;
}

export const useAuth = () => {
    const [user, setUser] = useState<{ id: number; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                setUser({ id: decodedToken.id, role: decodedToken.role });
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    return { user, loading };
};
