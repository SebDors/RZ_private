"use client"

import * as React from "react"
import {
  Search,
  Settings2,
  Gem,
  Hammer,
  LayoutDashboard,
  ShieldUser,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { AppInfos } from "@/components/sidebar/app-infos"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getConnectedUserProfile } from "@/services/users"
import { useState } from "react"
import type { User } from "@/models/models"

import logo from '@/assets/logos/logo blanc front BLEU_page-0001.jpg';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const connectedUser = await getConnectedUserProfile();
        setUser(connectedUser);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserData();
  }, []);


  const data = {
    user: {
      name: user?.first_name,
      email: user?.email,
      avatar: "",//TODO have images 
    },
    app: {
        name: "Rubin & Zonen",
        logo: logo,
        plan: "Enterprise",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
          },
          {
            title: "Truc1",
            url: "/dashboard",
          },
        ]
      },
      {
        title: "Search",
        url: "/search",
        icon: Search,
        isActive: false,
        items: [
          {
            title: "Search Diamond",
            url: "/search",
          },
          {
            title: "Favorite Stones",
            url: "/search",
          },
          {
            title: "Quick Search",
            url: "/quick-search",
          },
          {
            title: "Side Stone Search",
            url: "/side-stone-search",
          },
        ],
      },
      {
        title: "Diamond List",
        url: "/diamond-list",
        icon: Gem,
        items: [
          {
            title: "List",
            url: "/diamond-list",
          },
          {
            title: "Compare",
            url: "/diamond-list",
          },
        ],
      },
      {//TODO hide this part if not admin
        title: "Admin",
        url: "/admin",
        icon: ShieldUser,
        items: [
          {
            title: "Clients",
            url: "/admin/clients",
          },
          {
            title: "Filter Settings",
            url: "/admin/filter-settings",
          },
        ]
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "/settings",
          },
          {
            title: "Truc1",
            url: "/settings",
          },
          {
            title: "Truc2",
            url: "/settings",
          },
          {
            title: "Truc3",
            url: "#",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppInfos app={data.app} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={data.user as { name: string; email: string; avatar: string }} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
