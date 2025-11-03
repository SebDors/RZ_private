import { Outlet } from "react-router-dom"
import '../../css/Auth/Auth.css'

function Auth() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <Outlet/>
            </div>
        </div>
    )
}

export default Auth