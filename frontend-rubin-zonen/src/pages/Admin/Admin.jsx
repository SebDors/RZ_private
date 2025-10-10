// TODO implementer Admin page

import { Outlet } from "react-router-dom"

function Admin() {
    return (
        <div>
            Admin page
            <Outlet/>
        </div>
    )
}

export default Admin