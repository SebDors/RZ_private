import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/services/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { useRedirectIfNotAuth } from "@/hooks/useRedirect"

interface DashboardStats {
  specialStonesCount: number;
  upcomingStonesCount: number;
  totalAvailableStones: number;
}

function DashboardContent() {
  useRedirectIfNotAuth();

  const { setOpen, open } = useSidebar()
  const handleOpen = () => {
    if (!open) {
      setOpen(true)
    }
  }

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to fetch dashboard statistics.");
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <AppSidebar onClick={handleOpen} className="cursor-pointer" />
      <SidebarInset>
        <Header />
        {error && <p className="text-red-500">{error}</p>}
        {stats ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Dashboard Statistics</h2>
            <p>Special Stones: {stats.specialStonesCount}</p>
            <p>Upcoming Stones: {stats.upcomingStonesCount}</p>
            <p>Total Available Stones: {stats.totalAvailableStones}</p>
          </div>
        ) : !error && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}
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
