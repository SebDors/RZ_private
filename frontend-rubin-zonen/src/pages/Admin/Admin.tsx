import { Outlet } from "react-router-dom"
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
                <Outlet />
            </SidebarInset>
        </>
    )
}

export default Admin