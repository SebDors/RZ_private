import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDiamondById } from "@/services/diamonds";
import type { Diamant } from "@/models/models";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StoneDetailContent() {
    useRedirectIfNotAuth();
    const { stock_id } = useParams<{ stock_id: string }>();
    const { setOpen, open } = useSidebar();
    const [diamond, setDiamond] = useState<Diamant | null>(null);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    useEffect(() => {
        const fetchDiamond = async () => {
            if (stock_id) {
                try {
                    const diamondData = await getDiamondById(stock_id);
                    setDiamond(diamondData);
                } catch (error) {
                    console.error("Error fetching diamond details:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDiamond();
    }, [stock_id]);

    if (loading) {
        return (
            <div className="p-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!diamond) {
        return <div>Diamond not found.</div>;
    }

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                                    <p><strong>Stock ID:</strong> {diamond.stock_id}</p>
                                    <p><strong>Color:</strong> {diamond.color}</p>
                                    <p><strong>Clarity:</strong> {diamond.clarity}</p>
                                    <p><strong>Cut:</strong> {diamond.cut_grade}</p>
                                    <p><strong>Polish:</strong> {diamond.polish}</p>
                                    <p><strong>Symmetry:</strong> {diamond.symmetry}</p>
                                    <p><strong>Fluorescence:</strong> {diamond.fluorescence_intensity}</p>
                                    <p><strong>Lab:</strong> {diamond.lab}</p>
                                    <p><strong>Certificate:</strong> {diamond.certificate_number}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Measurements</h3>
                                    <p>{diamond.measurements}</p>
                                    <h3 className="text-lg font-semibold mb-2 mt-4">Price</h3>
                                    <p><strong>Price/Carat:</strong> ${diamond.price_carat}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Media</h3>
                                <div className="flex space-x-4">
                                    {/* Placeholders for image, video, certificate */}
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">Image</div>
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">Video</div>
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">Certificate</div>
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-2">
                                <Button>Add to Cart</Button>
                                <Button variant="outline">Add to Watchlist</Button>
                                <Button variant="outline">Make a Custom Offer</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </>
    );
}

export default function StoneDetail() {
    return (
        <SidebarProvider>
            <StoneDetailContent />
        </SidebarProvider>
    );
}