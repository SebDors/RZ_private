import { getToken } from "@/components/utils";
import type { User } from "@/models/models";

export const getAllUsers = async (): Promise<User[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    return data;
};

export const getUserById = async (id: number): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${id}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    return data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        }
    );
    const data = await response.json();
    return data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        }
    );
    const data = await response.json();
    return data;
};

export const deleteUser = async (id: number): Promise<any> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    return data;
};

export const getConnectedUserProfile = async (): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );
    const data = await response.json();
    return data;
};

export const updateConnectedUserProfile = async (user: Partial<User>): Promise<User> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/profile`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        }
    );
    const data = await response.json();
    return data;
};
