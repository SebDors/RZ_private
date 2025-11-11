import { useState, useEffect } from "react";
import { getWatchlist, deleteWatchlistItem } from "@/services/watchlist";
import { addItemToCart } from "@/services/cart"; // Assuming this function exists
import type { Diamant } from "@/models/models";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

function MyWatchlistContent() {
    useRedirectIfNotAuth();
    const { setOpen, open } = useSidebar();
    const [watchlistItems, setWatchlistItems] = useState<{ diamond: Diamant }[]>([]);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const fetchWatchlistItems = async () => {
        try {
            const items = await getWatchlist();
            setWatchlistItems(items);
        } catch (error) {
            console.error("Error fetching watchlist items:", error);
            toast.error("Failed to fetch watchlist items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlistItems();
    }, []);

    const handleRemoveItem = async (stock_id: string) => {
        try {
            await deleteWatchlistItem(stock_id);
            toast.success("Item removed from watchlist.");
            fetchWatchlistItems(); // Refresh the list
        } catch (error) {
            console.error("Error removing item from watchlist:", error);
            toast.error("Failed to remove item from watchlist.");
        }
    };

    const handleAddToCart = async (stock_id: string) => {
        try {
            await addItemToCart(stock_id, 1); // Assuming addItemToCart takes stock_id and quantity
            toast.success("Item added to cart.");
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ScrollArea className="h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {watchlistItems.map(({ diamond }) => (
                                    <Card key={diamond.stock_id}>
                                        <CardHeader>
                                            <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Color: {diamond.color}</p>
                                            <p>Clarity: {diamond.clarity}</p>
                                            <p>Price/Carat: ${diamond.price_carat}</p>
                                            <div className="flex justify-between mt-4">
                                                <Button variant="outline" onClick={() => handleRemoveItem(diamond.stock_id)}>Remove</Button>
                                                <Button onClick={() => handleAddToCart(diamond.stock_id)}>Add to Cart</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

export default function MyWatchlist() {
    return (
        <SidebarProvider>
            <MyWatchlistContent />
        </SidebarProvider>
    );
}