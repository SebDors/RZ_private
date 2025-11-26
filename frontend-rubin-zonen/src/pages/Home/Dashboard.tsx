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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const handleCardClick = (type: "special" | "upcoming" | "total") => {
    if (type === "total") {
      navigate("/search");
    } else if (type === "special") {
      navigate("/diamond-list", {
        state: { searchParams: { is_special: ["true"] } },
      });
    } else if (type === "upcoming") {
        navigate("/diamond-list", {
            state: { searchParams: { is_upcoming: ["true"] } },
        });
    }
  };

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
          <div className="mb-2">
            {error && <p className="text-red-500">{error}</p>}
            {stats ? (
              <div className="mb-8">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
                  Dashboard Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleCardClick("special")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Special Stones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.specialStonesCount}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleCardClick("upcoming")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Upcoming Stones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.upcomingStonesCount}
                      </div>
                    </CardContent>
                  </Card>
                  <Card
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleCardClick("total")}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Available Stones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.totalAvailableStones}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              !error && (
                <div className="mb-8">
                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
                    Dashboard Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                  </div>
                </div>
              )
            )}
          </div>
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