import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { useQuickSearch } from "@/hooks/useQuickSearch";
import { SavedSearches } from "@/components/SavedSearches";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  specialStonesCount: number;
  upcomingStonesCount: number;
  totalAvailableStones: number;
}

function DashboardContent() {
  useRedirectIfNotAuth();
  const navigate = useNavigate();

  const { setOpen, open } = useSidebar();
  const handleOpen = () => {
    if (!open) {
      setOpen(true);
    }
  };

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    lastSearches,
    savedSearches: dbSavedSearches,
    deleteLastSearch,
    deleteSavedSearch,
  } = useQuickSearch();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const statsData = await getDashboardStats();
        setStats(statsData);
      } catch (err) {
        setError("Failed to fetch dashboard statistics.");
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  const handleLoadSearch = (params: Record<string, string[]>) => {
    navigate('/diamond-list', { state: { searchParams: params } });
  };

  return (
    <>
      <AppSidebar onClick={handleOpen} className="cursor-pointer" />
      <SidebarInset>
        <Header />
        <div className="p-4 bg-secondary rounded-md h-full">
          <Card>
            <CardContent>
              {error && <p className="text-red-500">{error}</p>}
              {stats ? (
                <div className="mb-8">
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Dashboard Statistics
                  </h2>
                  <p>Special Stones: {stats.specialStonesCount}</p>
                  <p>Upcoming Stones: {stats.upcomingStonesCount}</p>
                  <p>Total Available Stones: {stats.totalAvailableStones}</p>
                </div>
              ) : (
                !error && (
                  <div className="space-y-2 mb-8">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                )
              )}
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SavedSearches
              title="Last Searches"
              searches={lastSearches}
              onLoad={handleLoadSearch}
              onDelete={(timestamp) => deleteLastSearch(timestamp as number)}
              deleteIdentifier="timestamp"
            />
            <SavedSearches<Record<string, string[]>>
              title="Saved Searches"
              searches={dbSavedSearches}
              onLoad={handleLoadSearch}
              onDelete={(id) => deleteSavedSearch(id as number)}
              deleteIdentifier="id"
            />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}