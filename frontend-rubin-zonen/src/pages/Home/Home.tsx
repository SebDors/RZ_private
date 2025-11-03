import { Button } from "@/components/ui/button"

//page temporaire pour lister toutes les pages accessibles

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main landing page of the application.</p>
            <Button onClick={handleLogout}>Logout</Button>
            <Outlet/>
        </div>
    );
}

export default Home;