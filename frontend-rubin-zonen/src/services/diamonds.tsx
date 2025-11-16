import { getToken } from "@/hooks/useRedirect";
import type { Diamant } from "@/models/models";

export const getAllDiamonds = async (filters?: Record<string, string>): Promise<Diamant[]> => {
    const query = new URLSearchParams(filters).toString();
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants?${query}`,
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

export const getDiamondById = async (stock_id: string): Promise<Diamant> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants/${stock_id}`,
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

export const createDiamond = async (diamond: Diamant): Promise<Diamant> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(diamond)
        }
    );
    const data = await response.json();
    return data;
};

export const updateDiamond = async (stock_id: string, diamond: Partial<Diamant>): Promise<Diamant> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants/${stock_id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(diamond)
        }
    );
    const data = await response.json();
    return data;
};

export const deleteDiamond = async (stock_id: string): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/diamants/${stock_id}`,
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
