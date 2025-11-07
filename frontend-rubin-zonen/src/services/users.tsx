import type { User } from "@/models/models";

export const getAllUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem("JWT");
    // const token = import.meta.env.VITE_TEMPORARY_JWT; // Temporary JWT for testing purpose

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