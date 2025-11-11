import { getToken } from "@/hooks/useRedirect";
import type { Filter } from "@/models/models";

export const getAllFilters = async (): Promise<Filter[]> => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/filters`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
    const data = await response.json();
    return data;
};

export const updateFilter = async (filter_name: string, is_enabled: boolean): Promise<Filter> => {
    const token = getToken();
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/filters/${filter_name}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ is_enabled })
        }
    );
    const data = await response.json();
    return data;
};
