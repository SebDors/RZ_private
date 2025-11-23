import Cookies from "js-cookie";
import type { SavedSearch } from "@/models/models";

interface SavedSearchRaw {
    id: number;
    user_id: number;
    name: string;
    search_params: string | Record<string, string[]>; // It can be a JSON string or already parsed object
    search_type: 'quick' | 'advanced';
    created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getSavedSearches = async (type: 'quick' | 'advanced'): Promise<SavedSearch[]> => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}/api/saved-searches?type=${type}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch saved searches");
    }

    const searches = await response.json();
    // params are stored as JSON strings in the DB, so we need to parse them if they are strings
    return searches.map((s: SavedSearchRaw) => ({ ...s, search_params: typeof s.search_params === 'string' ? JSON.parse(s.search_params) : s.search_params }));
};

export const saveSearch = async (name: string, search_params: Record<string, string[]>, search_type: 'quick' | 'advanced'): Promise<SavedSearch> => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }

    const response = await fetch(`${API_URL}/api/saved-searches`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, search_params, search_type }),
    });

    if (!response.ok) {
        throw new Error("Failed to save search");
    }
    return response.json();
};

export const deleteSavedSearch = async (id: number): Promise<void> => {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("No token found");
    }
    
    const response = await fetch(`${API_URL}/api/saved-searches/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete saved search");
    }
};
