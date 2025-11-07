import type { Diamant } from "@/models/models";

export const getAllDiamonds = async (): Promise<Diamant[]> => {
    const token = localStorage.getItem("JWT");
    // const token = import.meta.env.VITE_TEMPORARY_JWT; // Temporary JWT for testing purpose

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