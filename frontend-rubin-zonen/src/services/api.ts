import type { Diamant, User } from "@/models/models";

export const getAllDiamonds = async (): Promise<Diamant[]> => {
    //TODO const token = localStorage.getItem("JWT");
    const token = import.meta.env.VITE_TEMPORARY_JWT; // Temporary JWT for testing purpose

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants`,
        {
            method: 'GET',
            headers: {
                Accept: "application/json",
                Autorisation: "Bearer " + token,

            }
        }
    );
    const data = await response.json();
    return data;
};

export const getAllUsers = async (): Promise<User[]> => {
    // const token = localStorage.getItem("JWT");
    const token = import.meta.env.VITE_TEMPORARY_JWT; // Temporary JWT for testing purpose

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`,
        {
            method: 'GET',
            headers: {
                origin: 'http://localhost:5173',
                Accept: "application/json",
                Autorisation: "Bearer " + token,

            }
        }
    );
    const data = await response.json();
    return data;
};

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