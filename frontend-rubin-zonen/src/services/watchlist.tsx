import { getToken } from "@/components/utils";

export const getWatchlist = async ():Promise<any> => {
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

export const addItemToWatchlist = async (diamond_stock_id: string):Promise<any> => {
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

export const deleteWatchlistItem = async (diamond_stock_id: string):Promise<any> => {
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
