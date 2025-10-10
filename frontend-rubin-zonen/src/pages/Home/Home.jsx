//page temporaire pour lister toutes les pages accessibles

import { Outlet } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>This is the main landing page of the application.</p>
            <Outlet/>
        </div>
    );
}

export default Home;