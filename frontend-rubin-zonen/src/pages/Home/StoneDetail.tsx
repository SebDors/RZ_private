import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function StoneDetailContent() {
    useRedirectIfNotAuth();
    
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
                    <h2 className="text-2xl font-bold mb-4">Stone Detail</h2>
                    <p>Stone Detail</p>
                </div>
            </SidebarInset>
        </>
    )
}

export default function StoneDetail() {
    return (
        <SidebarProvider>
            <StoneDetailContent />
        </SidebarProvider>
    )
}