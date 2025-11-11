import { useState, useEffect } from "react";
import { getCart, updateCartItemQuantity, deleteCartItem } from "@/services/cart";
import type { Diamant } from "@/models/models";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
    diamond: Diamant;
    quantity: number;
}

function MyCartContent() {
    useRedirectIfNotAuth();
    const { setOpen, open } = useSidebar();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    const handleUpdateQuantity = async (stock_id: string, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(stock_id);
            return;
        }
        try {
            await updateCartItemQuantity(stock_id, quantity);
            toast.success("Cart updated.");
            fetchCartItems(); // Refresh the list
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            toast.error("Failed to update cart item quantity.");
        }
    };

    const handleRemoveItem = async (stock_id: string) => {
        try {
            await deleteCartItem(stock_id);
            toast.success("Item removed from cart.");
            fetchCartItems(); // Refresh the list
        } catch (error) {
            console.error("Error removing item from cart:", error);
            toast.error("Failed to remove item from cart.");
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.diamond.price_carat * item.diamond.weight * item.quantity, 0);
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
                                        {cartItems.map(({ diamond, quantity }) => (
                                            <Card key={diamond.stock_id}>
                                                <CardHeader>
                                                    <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Color: {diamond.color}</p>
                                                    <p>Clarity: {diamond.clarity}</p>
                                                    <p>Price/Carat: ${diamond.price_carat}</p>
                                                    <div className="flex items-center mt-4">
                                                        <Label htmlFor={`quantity-${diamond.stock_id}`} className="mr-2">Qty:</Label>
                                                        <Input
                                                            id={`quantity-${diamond.stock_id}`}
                                                            type="number"
                                                            min="1"
                                                            value={quantity}
                                                            onChange={(e) => handleUpdateQuantity(diamond.stock_id, parseInt(e.target.value))}
                                                            className="w-20"
                                                        />
                                                    </div>
                                                    <Button variant="destructive" onClick={() => handleRemoveItem(diamond.stock_id)} className="mt-4">
                                                        Remove
                                                    </Button>
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
                                        <div className="flex justify-between mb-2">
                                            <span>Subtotal</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                        <Button className="w-full mt-4">Checkout</Button>
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