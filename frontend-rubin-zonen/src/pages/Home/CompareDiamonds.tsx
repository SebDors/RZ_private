import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDiamondById } from "@/services/diamonds";
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
import { toast } from "sonner";


function CompareDiamondsContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { setOpen, open } = useSidebar();
    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);

    useEffect(() => {
        const diamondIds: string[] = location.state?.diamondIds || []; // Moved here
        if (diamondIds.length === 0) {
            toast.error("No diamonds selected for comparison.");
            navigate('/new-diamond-list'); // Redirect if no diamonds are passed
            return;
        }

        const fetchDiamonds = async () => {
            try {
                const fetchedDiamonds: Diamant[] = [];
                for (const id of diamondIds) {
                    const diamond = await getDiamondById(id);
                    fetchedDiamonds.push(diamond);
                }
                setDiamonds(fetchedDiamonds);
            } catch (error) {
                console.error("Error fetching diamonds for comparison:", error);
                toast.error("Failed to load some diamonds for comparison.");
            }
        };

        fetchDiamonds();
    }, [location.state, navigate]); // Added location.state to dependencies

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ml-2 mr-2 rounded-lg">
                    <div className="w-full max-w-6xl">
                        <h2 className="text-2xl font-bold mb-4">Compare Diamonds</h2>
                        {diamonds.length === 0 ? (
                            <p>Loading diamonds for comparison or no diamonds found.</p>
                        ) : (
                            <ScrollArea className="h-[80vh] w-full">
                                <div className="flex justify-around gap-4 p-4">
                                    {diamonds.map((diamond) => (
                                        <Card key={diamond.stock_id} className="w-1/3 min-w-[300px]">
                                            <CardHeader>
                                                <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Color: {diamond.color}</p>
                                                <p>Clarity: {diamond.clarity}</p>
                                                <p>Cut Grade: {diamond.cut_grade}</p>
                                                <p>Polish: {diamond.polish}</p>
                                                <p>Symmetry: {diamond.symmetry}</p>
                                                <p>Fluorescence: {diamond.fluorescence_intensity} ({diamond.fluorescence_color})</p>
                                                <p>Lab: {diamond.lab}</p>
                                                <p>Price/Carat: ${diamond.price_carat}</p>
                                                <p>Depth %: {diamond.depth_pct}</p>
                                                <p>Table %: {diamond.table_pct}</p>
                                                {/* Add more relevant comparison details here */}
                                                <Button onClick={() => navigate(`/stone-detail/${diamond.stock_id}`)} className="mt-4">
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                        <div className="flex justify-center mt-4">
                            <Button onClick={() => navigate('/new-diamond-list')}>Back to Diamond List</Button>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </>
    );
}

export default function CompareDiamonds() {
    return (
        <SidebarProvider>
            <CompareDiamondsContent />
        </SidebarProvider>
    );
}
