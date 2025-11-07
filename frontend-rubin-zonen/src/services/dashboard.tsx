export const getDashboardStats = async ():Promise<any> => {
    const token = localStorage.getItem('token');
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