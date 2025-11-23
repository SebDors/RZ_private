import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllDiamonds } from "@/services/diamonds";
import type { Diamant } from "@/models/models";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
    SidebarInset,
    SidebarProvider,
    useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";

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

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ml-2 mr-2 rounded-lg">
                    {/* TODO fix the bottom of the screen */}
                    <div className="w-full max-w-4xl">
                        <h2 className="text-2xl font-bold mb-4">Diamond List</h2>
                        <ScrollArea className="h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-3 gap-4">
                                {diamonds.map((diamond) => (
                                    <Card key={diamond.stock_id}>
                                        <CardHeader>
                                            <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Color: {diamond.color}</p>
                                            <p>Clarity: {diamond.clarity}</p>
                                            <p>Price/Carat: ${diamond.price_carat}</p>
                                            <Button onClick={() => navigate(`/stone-detail/${diamond.stock_id}`)} className="mt-4">
                                                Show Details
                                            </Button>
                                        </CardContent>
                                    </Card>))}
                            </div>
                        </ScrollArea>
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