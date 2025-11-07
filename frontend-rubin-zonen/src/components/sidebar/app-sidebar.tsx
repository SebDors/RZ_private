"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Search,
  Settings2,
  ScanSearch,
  Gem,
  Hammer,
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
      avatar: "",
    },
    app: {
        name: "Rubin & Zonen",
        logo: logo,
        plan: "Enterprise",
    },
    navMain: [
      {
        title: "Search",
        url: "/Search",
        icon: Search,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Quick Search",
            url: "#",
          },
          {
            title: "Side Stone Search",
            url: "#",
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
            url: "#",
          },
          {
            title: "Compare",
            url: "#",
          },
        ],
      },
      {
        title: "Stone Detail",
        url: "/stone-detail",
        icon: Hammer,
        items: [
          {
            title: "List",
            url: "#",
          },
          {
            title: "Compare",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Truc1",
            url: "#",
          },
          {
            title: "Truc2",
            url: "#",
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
