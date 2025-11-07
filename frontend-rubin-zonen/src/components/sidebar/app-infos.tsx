import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

export function AppInfos({
  app,
}: {
  app: {
    name: string
    logo: string
    plan: string
  }
}) {
  const { open } = useSidebar()
  const navigate = useNavigate()

  const handleClick = () => {
    if (open) {
      navigate("/")
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <img src={app.logo} alt={app.name} className="w-9 h-16 rounded-md" onClick={handleClick}/>
              <div className="grid flex-1 text-left text-sm leading-tight" onClick={handleClick}>
                <span className="truncate font-medium">{app.name}</span>
                <span className="truncate text-xs">{app.plan}</span>
              </div>
              <SidebarTrigger />
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
