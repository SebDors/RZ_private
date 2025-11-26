import { Outlet, Link } from "react-router-dom"
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
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function MyAccountContent() {
    useRedirectIfNotAuth();
    const { setOpen, open } = useSidebar()
    // const { logout } = useAuth();
    // const navigate = useNavigate();

    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }

    // const handleLogout = () => {
    //     logout();
    //     navigate('/login');
    // };

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
                                        {/* fix color */}
                                        <Link to="/my-account/profile" className="hover:grey">Profile</Link>
                                        {/* <Link to="/my-account/orders" className="hover:grey">Order History</Link> */}
                                        <Link to="/my-account/settings" className="hover:grey">Settings</Link>
                                        {/* <Link to="/my-account/login-history" className="hover:grey">Login History</Link> */}
                                        <Link to="/my-account/delete" className="hover:grey">Delete Account</Link>
                                        {/* <button onClick={handleLogout} className="hover:grey text-left">Logout</button> */}
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