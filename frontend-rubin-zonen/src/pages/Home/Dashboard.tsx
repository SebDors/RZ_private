import Header from "@/components/Header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <Card className="w-full max-w-4xl p-8">
                    <CardHeader>
                        <CardTitle>Dashboard</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats ? (
                            <div>
                                <p>Special Stones: {stats.specialStonesCount}</p>
                                <p>Upcoming Stones: {stats.upcomingStonesCount}</p>
                                <p>Total Available Stones: {stats.totalAvailableStones}</p>
                            </div>
                        ) : (
                            <p>Loading stats...</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Dashboard