import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

import { getDashboardStats } from "@/services/dashboard";
import { useEffect, useState } from "react";

function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <>
        <SidebarProvider>
            <AppSidebar />
            
            <SidebarInset>
                <Header />


                <div className="w-full max-w-4xl p-8">
                    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Dashboard</h2>
                    {stats ? (
                        <div>
                            <p>Special Stones: {stats.specialStonesCount}</p>
                            <p>Upcoming Stones: {stats.upcomingStonesCount}</p>
                            <p>Total Available Stones: {stats.totalAvailableStones}</p>
                        </div>
                    ) : (
                        <p>Loading stats...</p>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
            

        </>
    )
}

export default Dashboard