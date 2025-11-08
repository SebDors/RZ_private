import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"

function SettingsContent() {
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
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <h2>Settings</h2>
                    <p>The settings are here</p>
                </div>
            </SidebarInset>
        </>
    )
}

export default function Settings() {
    return (
        <SidebarProvider>
            <SettingsContent />
        </SidebarProvider>
    )
}