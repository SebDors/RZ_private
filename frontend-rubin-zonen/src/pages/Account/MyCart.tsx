import { useState, useEffect } from "react";
import { getCart, deleteCartItem, addItemToCart } from "@/services/cart";
import { addItemToWatchlist, deleteWatchlistItem } from "@/services/watchlist";
import type { CartItem } from "@/services/cart";
import { sendCustomEmail } from "@/services/email"; // Import sendCustomEmail
import { getDiamondById } from "@/services/diamonds";

import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { createQuote } from "@/services/quote";
import { exportToExcel } from "@/lib/export";
import { Spinner } from "@/components/ui/spinner";

function MyCartContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const ADMIN_EMAIL_RECEIVER = import.meta.env.VITE_ADMIN_EMAIL_RECEIVER;

    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const fetchCartItems = async () => {
        try {
            const items = await getCart();
            setCartItems(items);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            toast.error("Failed to fetch cart items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleRemoveItem = async (stock_id: string) => {
        try {
            const { deletedItem } = await deleteCartItem(stock_id);
            toast.success("Item removed from cart.", {
                action: {
                    label: "Undo",
                    onClick: () => handleUndoRemoveItem(deletedItem),
                },
            });
            fetchCartItems(); // Refresh the list
        } catch (error) {
            console.error("Error removing item from cart:", error);
            toast.error("Failed to remove item from cart.");
        }
    };

    const handleUndoRemoveItem = async (item: CartItem) => {
        try {
            await addItemToCart(item.diamond_stock_id);
            fetchCartItems();
        } catch (error) {
            console.error("Error undoing remove from cart:", error);
            toast.error("Failed to undo remove from cart.");
        }
    };

    const handleMoveToWatchlist = async (stock_id: string) => {
        try {
            const cartItem = cartItems.find(item => item.diamond_stock_id === stock_id);
            if (!cartItem) return;
    
            await addItemToWatchlist(stock_id);
            const { deletedItem } = await deleteCartItem(stock_id);
            
            toast.success("Item moved to watchlist.", {
                action: {
                    label: "Undo",
                    onClick: () => handleUndoMoveToWatchlist(deletedItem),
                },
            });
    
            fetchCartItems(); // Refresh cart
        } catch (error) {
            console.error("Error moving item to watchlist:", error);
            toast.error("Failed to move item to watchlist.");
        }
    };

    const handleUndoMoveToWatchlist = async (item: CartItem) => {
        try {
            await addItemToCart(item.diamond_stock_id);
            await deleteWatchlistItem(item.diamond_stock_id);
            fetchCartItems();
        } catch (error) {
            console.error("Error undoing move to watchlist:", error);
            toast.error("Failed to undo move to watchlist.");
        }
    };


    const handleAskQuote = async () => {
        if (cartItems.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        const diamondStockIds = cartItems.map(item => item.diamond_stock_id);

        try {
            await createQuote(diamondStockIds);
            toast.success("Quote request sent successfully.", {
                action: {
                    label: "View My Quotes",
                    onClick: () => navigate("/my-quote"),
                },
            });

            // Send email to test address
            const subject = "New Quote Request from Rubin & Zonen"; 
            const textContent = `A new quote has been requested for the following diamond stock IDs: ${diamondStockIds.join(', ')}.`;
            await sendCustomEmail(ADMIN_EMAIL_RECEIVER, subject, textContent);
            toast.success("Notification email sent to test address.");

            // Clear the cart after quote creation
            for (const item of cartItems) {
                await deleteCartItem(item.diamond_stock_id);
            }
            fetchCartItems();
        } catch (error) {
            console.error("Error creating quote:", error);
            toast.error("Failed to create quote.");
        }
    };


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + Number(item.price_carat) * item.weight, 0);
    };

    const handleExport = async () => {
        if (cartItems.length === 0) {
            toast.error("No items in cart to export.");
            return;
        }

        try {
            setLoading(true);
            const detailedCartItems = await Promise.all(
                cartItems.map(item => getDiamondById(item.diamond_stock_id))
            );

            const dataToExport = detailedCartItems.map(d => ({
                "Stock ID": d.stock_id,
                "Availability": d.availability,
                "Shape": d.shape,
                "Weight": d.weight,
                "Color": d.color,
                "Clarity": d.clarity,
                "Cut Grade": d.cut_grade,
                "Polish": d.polish,
                "Symmetry": d.symmetry,
                "Fluorescence Intensity": d.fluorescence_intensity,
                "Fluorescence Color": d.fluorescence_color,
                "Measurements": d.measurements,
                "Lab": d.lab,
                "Certificate Number": d.certificate_number,
                "Treatment": d.treatment,
                "Price/Carat": d.price_carat,
                "Fancy Color": d.fancy_color,
                "Fancy Color Intensity": d.fancy_color_intensity,
                "Fancy Color Overtone": d.fancy_color_overtone,
                "Depth %": d.depth_pct,
                "Table %": d.table_pct,
                "Girdle Thin": d.girdle_thin,
                "Girdle Thick": d.girdle_thick,
                "Girdle %": d.girdle_pct,
                "Girdle Condition": d.girdle_condition,
                "Culet Size": d.culet_size,
                "Culet Condition": d.culet_condition,
                "Crown Height": d.crown_height,
                "Crown Angle": d.crown_angle,
                "Pavilion Depth": d.pavilion_depth,
                "Pavilion Angle": d.pavilion_angle,
                "Laser Inscription": d.laser_inscription,
                "Comment": d.comment,
                "Country": d.country,
                "State": d.state,
                "City": d.city,
                "Is Matched Pair Separable": d.is_matched_pair_separable,
                "Pair Stock ID": d.pair_stock_id,
                "Allow Raplink Feed": d.allow_raplink_feed,
                "Parcel Stones": d.parcel_stones,
                "Certificate Filename": d.certificate_filename,
                "Diamond Image": d.diamond_image,
                "3D File": d["3d_file"],
                "Trade Show": d.trade_show,
                "Member Comments": d.member_comments,
                "Rap": d.rap,
                "Disc": d.disc,
                "Video File": d.video_file,
                "Image File": d.image_file,
                "Certificate File": d.certificate_file,
                "Is Special": d.is_special,
                "Is Upcoming": d.is_upcoming,
            }));

            exportToExcel(dataToExport, "cart");
        } catch (error) {
            toast.error("Could not export cart details.");
            console.error("Export error:", error);
        } finally {
            setLoading(false);
        }
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
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">My Cart</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex">
                            <div className="w-3/4 pr-4">
                                <ScrollArea className="h-[80vh]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {cartItems.map((item) => (
                                            <Card key={item.diamond_stock_id}>
                                                <CardHeader>
                                                    <CardTitle>{item.shape} {item.weight}ct</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Color: {item.color}</p>
                                                    <p>Clarity: {item.clarity}</p>
                                                                                                        <p>Price/Carat: ${Number(item.price_carat).toFixed(2)}</p>
                                                                                                        <p>Weight: {item.weight}</p>                                                    
                                                    <div className="flex flex-col space-y-2 mt-4">
                                                        <Button variant="destructive" onClick={() => handleRemoveItem(item.diamond_stock_id)}>
                                                            Remove
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleMoveToWatchlist(item.diamond_stock_id)}>
                                                            Move to Watchlist
                                                        </Button>
                                                        <Button variant="outline" onClick={() => navigate(`/stone-detail/${item.diamond_stock_id}`)}>
                                                            Show Details
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="w-1/4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cart Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <Button className="w-full mt-4" onClick={handleAskQuote}>Ask a Quote</Button>
                                        <Button className="w-full mt-4" variant="outline" onClick={handleExport}>Export to Excel</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

export default function MyCart() {
    return (
        <SidebarProvider>
            <MyCartContent />
        </SidebarProvider>
    );
}