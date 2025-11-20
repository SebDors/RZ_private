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
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { SavedSearches } from "@/components/SavedSearches";
import { useNavigate } from "react-router-dom";

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
    savedSearches,
    deleteLastSearch,
    deleteSavedSearch,
  } = useSearchHistory();

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

  const handleLoadSearch = (params: Record<string, string>) => {
    const searchString = new URLSearchParams(params).toString();
    navigate(`/search?${searchString}`);
  };

  return (
    <>
      <AppSidebar onClick={handleOpen} className="cursor-pointer" />
      <SidebarInset>
        <Header />
        <div className="p-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SavedSearches
              title="Last Searches"
              searches={lastSearches}
              onLoad={handleLoadSearch}
              onDelete={(timestamp) => deleteLastSearch(timestamp as number)}
              deleteIdentifier="timestamp"
            />
            <SavedSearches
              title="Saved Searches"
              searches={savedSearches}
              onLoad={handleLoadSearch}
              onDelete={(name) => deleteSavedSearch(name as string)}
              deleteIdentifier="name"
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
