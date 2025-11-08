import { getToken } from "@/hooks/useRedirect";
import type { Diamant } from "@/models/models";

export const getCart = async (): Promise<{ diamond: Diamant, quantity: number }[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart`,
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

export const addItemToCart = async (diamond_stock_id: string, quantity: number): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ diamond_stock_id, quantity })
        }
    );
    const data = await response.json();
    return data;
};

export const updateCartItemQuantity = async (diamond_stock_id: string, quantity: number): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/${diamond_stock_id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        }
    );
    const data = await response.json();
    return data;
};

export const deleteCartItem = async (diamond_stock_id: string): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/cart/${diamond_stock_id}`,
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
