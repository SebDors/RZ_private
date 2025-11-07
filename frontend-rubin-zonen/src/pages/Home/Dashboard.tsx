import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"

function DashboardContent() {
  const { setOpen, open } = useSidebar()
  const handleOpen = () => {
    if (!open) {
      setOpen(true)
    }
  }
  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        <AppSidebar />
      </div>
      <SidebarInset>
        <Header/>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </>
  )
}

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}
