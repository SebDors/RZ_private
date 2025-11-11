import { Outlet, Link, useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

function MyAccountContent() {
    const { setOpen, open } = useSidebar()
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <Card className="w-[900px]">
                        <CardHeader>
                            <CardTitle>My Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex">
                                <div className="w-1/4 border-r pr-4">
                                    <nav className="flex flex-col space-y-2">
                                        <Link to="/my-account/profile" className="text-blue-600 hover:underline">Profile</Link>
                                        <Link to="/my-account/orders" className="text-blue-600 hover:underline">Order History</Link>
                                        <Link to="/my-account/settings" className="text-blue-600 hover:underline">Settings</Link>
                                        <Link to="/my-account/login-history" className="text-blue-600 hover:underline">Login History</Link>
                                        <Link to="/my-account/delete" className="text-red-600 hover:underline">Delete Account</Link>
                                        <button onClick={handleLogout} className="text-blue-600 hover:underline text-left">Logout</button>
                                    </nav>
                                </div>
                                <div className="w-3/4 pl-4">
                                    <Outlet />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </>
    )
}

export default function MyAccount() {
    return (
        <SidebarProvider>
            <MyAccountContent />
        </SidebarProvider>
    )
}