import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "../../components/ui/button"
import { Outlet, useNavigate } from 'react-router-dom';

//page temporaire pour lister toutes les pages accessibles
function Home() {
    useRedirectIfNotAuth();

    const navigate = useNavigate();

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