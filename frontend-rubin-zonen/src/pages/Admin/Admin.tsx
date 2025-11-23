import { Link, Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { useRedirectIfNotAdmin } from "@/hooks/useRedirect"

function Admin() {
    useRedirectIfNotAdmin();
    const { setOpen, open } = useSidebar()
    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }
    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex">
                    <div className="w-1/4 p-4 border-r">
                        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
                        <nav className="flex flex-col space-y-2">
                            <Link to="clients">Clients</Link>
                            <Link to="filter-settings">Filter Settings</Link>
                            <Link to="import-data">Import Data</Link>
                            <Link to="all-quotes">All Quotes</Link>
                            <Link to="email-templates">Email Templates</Link>
                        </nav>
                    </div>
                    <div className="w-3/4 p-4">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}

export default Admin