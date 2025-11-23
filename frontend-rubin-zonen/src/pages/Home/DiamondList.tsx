import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllDiamonds } from "@/services/diamonds";
import type { Diamant } from "@/models/models";
// Removed Card, CardContent, CardHeader, CardTitle imports
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
// Removed ScrollArea import
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
// Removed Button import

// New imports for DataTable
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "@/components/datatable/columns"; // Using the corrected columns.tsx

function DiamondListContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { setOpen, open } = useSidebar()
    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);

    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                let filters: Record<string, string> = {};
                if (location.state && location.state.searchParams) {
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
            } catch (error) {
                console.error("Error fetching diamonds:", error);
            }
        };

        fetchDiamonds();
    }, [location.state]);

    // Function to navigate to stone detail
    const navigateToDetail = (stock_id: string) => {
        navigate(`/stone-detail/${stock_id}`);
    };

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ml-2 mr-2 rounded-lg">
                    <div className="w-full max-w-4xl">
                        <h2 className="text-2xl font-bold mb-4">Diamond List</h2>
                        <DataTable columns={columns} data={diamonds} meta={{ navigateToDetail }} />
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}

export default function DiamondList() {
    return (
        <SidebarProvider>
            <DiamondListContent />
        </SidebarProvider>
    )
}