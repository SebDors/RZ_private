import { getToken } from "@/lib/utils";

export interface QuoteItem {
    stock_id: string;
    shape: string;
    weight: number;
    color: string;
    clarity?: string;
    price_carat?: number;
}

export interface Quote {
    id: number;
    status: string;
    created_at: string;
    updated_at?: string;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        company_name?: string;
    };
    items: QuoteItem[];
}

export const createQuote = async (diamond_stock_ids: string[]): Promise<{ message: string; quote: Quote }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quotes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ diamond_stock_ids })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create quote.');
    }
    return data;
};

export const getUserQuotes = async (): Promise<Quote[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quotes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user quotes.');
    }
    return data;
};

export const getAllQuotes = async (): Promise<Quote[]> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quotes/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch all quotes.');
    }
    return data;
};

export const getQuoteById = async (id: number): Promise<Quote> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quotes/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quote.');
    }
    return data;
};

export const updateQuoteStatus = async (id: number, status: string): Promise<{ message: string; quote: Quote }> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/quotes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update quote status.');
    }
    return data;
};
