import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function QuickSearchContent() {
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
                    <h2 className="text-2xl font-bold mb-4">Quick Search</h2>
                    <p>Quick Search</p>
                </div>
            </SidebarInset>
        </>
    )
}

export default function QuickSearch() {
    return (
        <SidebarProvider>
            <QuickSearchContent />
        </SidebarProvider>
    )
}