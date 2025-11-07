import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function AppInfos({
  app,
}: {
  app: {
    name: string
    logo: string
    plan: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <img src={app.logo} alt={app.name} className="w-9 h-16 rounded-md" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{app.name}</span>
                <span className="truncate text-xs">{app.plan}</span>
                
              </div>
              <SidebarTrigger />
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
