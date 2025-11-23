import { getToken } from "@/lib/utils";

export interface WatchlistItem {
    diamond_stock_id: string;
    added_at: string;
    shape: string;
    weight: number;
    color: string;
    clarity: string;
    price_carat: number;
    image_file: string;
}

export const getWatchlist = async (): Promise<WatchlistItem[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/watchlist`,
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

export const addItemToWatchlist = async (diamond_stock_id: string): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/watchlist`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ diamond_stock_id })
        }
    );
    const data = await response.json();
    return data;
};

export const deleteWatchlistItem = async (diamond_stock_id: string): Promise<{ message: string }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/watchlist/${diamond_stock_id}`,
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
