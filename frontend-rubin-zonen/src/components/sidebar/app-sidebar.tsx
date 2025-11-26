"use client"

import * as React from "react"
import {
  Search,
  Gem,
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

  const allNavItems = [
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
          title: "Quick Search",
          url: "/quick-search",
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
      ],
    },
    {
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
        {
          title: "Manual Sync Data",
          url: "/admin/import-data",
        },
        {
          title: "All Quotes",
          url: "/admin/all-quotes",
        },
        {
          title: "Email Templates",
          url: "/admin/email-templates",
        },
      ]
    },
  ];

  const navItems = user?.is_admin ? allNavItems : allNavItems.filter(item => item.title !== "Admin");

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
    navMain: navItems,
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
