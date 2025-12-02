import { useState, useEffect } from "react";
import { getCart, deleteCartItem, addItemToCart } from "@/services/cart";
import { addItemToWatchlist, deleteWatchlistItem } from "@/services/watchlist";
import type { CartItem } from "@/services/cart";
import { sendCustomEmail } from "@/services/email"; // Import sendCustomEmail

import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createQuote } from "@/services/quote";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function MyCartContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState<Date | undefined>(undefined);

    // Define test email receiver here
    const TEST_EMAIL_RECEIVER = "test@example.com";

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
            await sendCustomEmail(TEST_EMAIL_RECEIVER, subject, textContent);
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
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal mt-4",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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