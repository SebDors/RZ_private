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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox

function NewDiamondListContent() {
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
    const [selectedDiamonds, setSelectedDiamonds] = useState<string[]>([]);

    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                let filters = {};
                if (location.state && location.state.searchParams) {
                    const { searchParams } = location.state;
                    const processedFilters: Record<string, string> = {};

                    if (searchParams.shape && searchParams.shape.length > 0) {
                        processedFilters.shape = searchParams.shape.join(',');
                    }
                    if (searchParams.color && searchParams.color.length > 0) {
                        processedFilters.color = searchParams.color.join(',');
                    }
                    if (searchParams.clarity && searchParams.clarity.length > 0) {
                        processedFilters.clarity = searchParams.clarity.join(',');
                    }
                    if (searchParams.carat && searchParams.carat.length > 0) {
                        const allValues = searchParams.carat.flatMap((range: string) => range.split('-').map(Number));
                        processedFilters.minCarat = String(Math.min(...allValues));
                        processedFilters.maxCarat = String(Math.max(...allValues));
                    }
                    filters = processedFilters;
                }
                const diamondsData = await getAllDiamonds(filters);
                setDiamonds(diamondsData);
            } catch (error) {
                console.error("Error fetching diamonds:", error);
            }
        };

        fetchDiamonds();
    }, [location.state]);

    const handleSelectDiamond = (stockId: string) => {
        setSelectedDiamonds(prevSelected => {
            if (prevSelected.includes(stockId)) {
                return prevSelected.filter(id => id !== stockId);
            } else if (prevSelected.length < 3) { // Allow up to 3 diamonds for comparison
                return [...prevSelected, stockId];
            }
            return prevSelected; // If more than 3 are already selected, do nothing
        });
    };

    const handleCompare = () => {
        if (selectedDiamonds.length >= 2 && selectedDiamonds.length <= 3) {
            navigate('/compare-diamonds', { state: { diamondIds: selectedDiamonds } });
        } else {
            // Optionally, show a toast or alert if selection is not 2-3
            alert('Please select 2 or 3 diamonds to compare.');
        }
    };

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ml-2 mr-2 rounded-lg">
                    {/* TODO fix the bottom of the screen */}
                    <div className="w-full ml-2 mr-2">
                        <div className="mb-4 ml-4 flex">
                            <Button onClick={handleCompare} disabled={selectedDiamonds.length < 2 || selectedDiamonds.length > 3}>
                                Compare ({selectedDiamonds.length})
                            </Button>
                        </div>
                        <ScrollArea className="h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                                {diamonds.map((diamond) => (
                                    <Card key={diamond.stock_id} onClick={() => handleSelectDiamond(diamond.stock_id)}>
                                        <CardHeader className="flex flex-row items-center justify-between space-x-4">
                                            <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                            <Checkbox
                                                checked={selectedDiamonds.includes(diamond.stock_id)}
                                            />
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

export default function NewDiamondList() {
    return (
        <SidebarProvider>
            <NewDiamondListContent />
        </SidebarProvider>
    )
}