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
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Manage your account settings.</p>
                        </CardContent>
                    </Card>
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