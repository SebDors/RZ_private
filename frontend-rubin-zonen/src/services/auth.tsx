import type { User } from "@/models/models";

export const loginUser = async (email: string, password: string):Promise<any> => {
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

export const registerUser = async (user: User):Promise<any> => {
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