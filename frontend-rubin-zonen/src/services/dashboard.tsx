import { getToken } from "@/hooks/useRedirect";

export const getDashboardStats = async (): Promise<{ specialStonesCount: number; upcomingStonesCount: number; totalAvailableStones: number }> => {
    const token = getToken();
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/dashboard/stats`,
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