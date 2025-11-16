import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDiamondById } from "@/services/diamonds";
import { addItemToCart } from "@/services/cart";
import { addItemToWatchlist } from "@/services/watchlist";
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
import { toast } from "sonner";

function StoneDetailContent() {
    useRedirectIfNotAuth();
    const { stock_id } = useParams<{ stock_id: string }>();
    const navigate = useNavigate();
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

    const handleAddToCart = async () => {
        if (stock_id) {
            try {
                await addItemToCart(stock_id, 1);
                toast.success("Item added to cart", {
                    action: {
                        label: "View Cart",
                        onClick: () => navigate("/my-cart"),
                    },
                });
            } catch (error) {
                console.error("Error adding item to cart:", error);
                toast.error("Failed to add item to cart.");
            }
        }
    };

    const handleAddToWatchlist = async () => {
        if (stock_id) {
            try {
                await addItemToWatchlist(stock_id);
                toast.success("Item added to watchlist", {
                    action: {
                        label: "View Watchlist",
                        onClick: () => navigate("/my-watchlist"),
                    },
                });
            } catch (error) {
                console.error("Error adding item to watchlist:", error);
                toast.error("Failed to add item to watchlist.");
            }
        }
    };

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
                                    <p>
                                        <strong>Certificate:</strong>{' '}
                                        {diamond.certificate_file ? (
                                            <a href={diamond.certificate_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {diamond.certificate_number}
                                            </a>
                                        ) : (
                                            diamond.certificate_number
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Measurements</h3>
                                    <p>{diamond.measurements}</p>
                                    <h3 className="text-lg font-semibold mb-2 mt-4">Price : ???</h3>
                                    {/* TODO show the price */}
                                    <p><strong>Price/Carat :</strong> ${diamond.price_carat}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Media</h3>
                                <div className="flex space-x-4">
                                    {(diamond.diamond_image || diamond.image_file) && (
                                        <div className="w-32 h-32 flex items-center justify-center border rounded-md overflow-hidden">
                                            <img src={diamond.diamond_image || diamond.image_file} alt="Diamond" className="object-cover h-full w-full" />
                                        </div>
                                    )}
                                    {diamond.video_file && (
                                        <div className="w-32 h-32 flex items-center justify-center border rounded-md overflow-hidden">
                                            <video controls src={diamond.video_file} className="object-cover h-full w-full">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex space-x-2">
                                <Button onClick={handleAddToCart}>Add to Cart</Button>
                                <Button variant="outline" onClick={handleAddToWatchlist}>Add to Watchlist</Button>
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