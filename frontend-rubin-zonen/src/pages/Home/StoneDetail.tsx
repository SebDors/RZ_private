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
                    <Card className="w-full max-w-4xl p-8">
                        <CardHeader>
                            <CardTitle>Stone Detail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Stone detail information will be displayed here.</p>
                        </CardContent>
                    </Card>
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