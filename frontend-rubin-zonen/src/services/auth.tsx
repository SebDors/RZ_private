import type { User } from "@/models/models";

export const loginUser = async (email: string, password: string): Promise<{ token?: string; message?: string }> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        }
    );
    const data = await response.json();
    return data;
};

export const registerUser = async (user: User): Promise<{ message: string }> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        }
    );
    const data = await response.json();
    return data;
}

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send password reset email.');
    }
    return data;
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
    }
    return data;
};

export const checkToken = async (token: string): Promise<{ isValid: boolean; role?: string; message?: string }> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/check-token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const data = await response.json();
    if (!response.ok) {
        return { isValid: false, message: data.message || 'Token validation failed.' };
    }
    return { isValid: true, role: data.role };
};