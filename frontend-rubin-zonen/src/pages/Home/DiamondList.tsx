import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllDiamonds } from "@/services/diamonds";
import type { Diamant } from "@/models/models";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "@/components/datatable/columns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function DiamondListContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { setOpen, open } = useSidebar();
    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNoResultsDialog, setShowNoResultsDialog] = useState(false);

    useEffect(() => {
        const fetchDiamonds = async () => {
            setLoading(true);
            try {
                let filters: Record<string, string> = {};
                const hasSearchParams = location.state && location.state.searchParams;

                if (hasSearchParams) {
                    const { searchParams } = location.state;
                    const processedFilters: Record<string, string[] | undefined> = {};

                    const processFilter = (filterName: string) => {
                        if (searchParams[filterName] && searchParams[filterName].length > 0 && !searchParams[filterName].includes('All') && !searchParams[filterName].includes('ANY')) {
                            processedFilters[filterName] = searchParams[filterName];
                        }
                    };

                    processFilter('shape');
                    processFilter('color');
                    processFilter('clarity');
                    processFilter('lab');
                    processFilter('cut');
                    processFilter('polish');
                    processFilter('symmetry');
                    processFilter('fluorescence');
                    processFilter('is_special');
                    processFilter('is_upcoming');

                    if (searchParams.carat && searchParams.carat.length > 0) {
                        processedFilters.carat = searchParams.carat.map((range: string) => {
                            if (range === "Less than 0.30") {
                                return "0-0.30";
                            }
                            if (range === "More than 10.00") {
                                return "10-9999";
                            }
                            return range;
                        });
                    }

                    const definedFilters: Record<string, string> = {};
                    const filterMappings: Record<string, string> = {
                        shape: 'shape',
                        color: 'color',
                        clarity: 'clarity',
                        carat: 'carat',
                        cut: 'cut_grade',
                        polish: 'polish',
                        symmetry: 'symmetry',
                        fluorescence: 'fluorescence_intensity',
                        lab: 'lab',
                        is_special: 'is_special',
                        is_upcoming: 'is_upcoming',
                    };

                    for (const key in processedFilters) {
                        if (processedFilters[key]) {
                            const backendKey = filterMappings[key];
                            if (backendKey) {
                                definedFilters[backendKey] = processedFilters[key]!.join(',');
                            }
                        }
                    }
                    filters = definedFilters;
                }
                const diamondsData = await getAllDiamonds(filters);
                setDiamonds(diamondsData);

                if (hasSearchParams && diamondsData.length === 0) {
                    setShowNoResultsDialog(true);
                }

            } catch (error) {
                console.error("Error fetching diamonds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiamonds();
    }, [location.state]);

    const navigateToDetail = (stock_id: string) => {
        navigate(`/stone-detail/${stock_id}`);
    };

    const handleCustomDemand = () => {
        toast("We will look at your demand.");//TODO change the message and send a mail to the admin
        setShowNoResultsDialog(false);
        navigate(-1);
    };

    const handleBackToSearch = () => {
        setShowNoResultsDialog(false);
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4 bg-secondary rounded-md h-full">
                    <DataTable columns={columns} data={diamonds} meta={{ navigateToDetail }}/>
                </div>
            </SidebarInset>

            <AlertDialog open={showNoResultsDialog} onOpenChange={setShowNoResultsDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>No Results</AlertDialogTitle>
                        <AlertDialogDescription>
                            No diamonds matching your criteria are available. Would you like to make a custom demand?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleBackToSearch}>No</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCustomDemand}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default function DiamondList() {
    return (
        <SidebarProvider>
            <DiamondListContent />
        </SidebarProvider>
    );
}