import { useState, useEffect } from "react";
import { getUserQuotes } from "@/services/quote";
import type { Quote } from "@/services/quote";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function MyQuoteContent() {
    useRedirectIfNotAuth();
    const { setOpen, open } = useSidebar();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const userQuotes = await getUserQuotes();
                setQuotes(userQuotes);
            } catch (error) {
                console.error("Error fetching quotes:", error);
                toast.error("Failed to fetch quotes.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, []);

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">My Quotes</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ScrollArea className="h-[80vh]">
                            <div className="space-y-4">
                                {quotes.length > 0 ? (
                                    quotes.map((quote) => (
                                        <Card key={quote.id}>
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-center">
                                                    <span>Quote #{quote.id}</span>
                                                    <Badge>{quote.status}</Badge>
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">
                                                    Created on: {new Date(quote.created_at).toLocaleDateString()}
                                                </p>
                                            </CardHeader>
                                            <CardContent>
                                                <h4 className="font-semibold">Items:</h4>
                                                <ul className="list-disc pl-5 mt-2">
                                                    {quote.items.map((item) => (
                                                        <li key={item.stock_id}>
                                                            {item.shape} {item.weight}ct, {item.color}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p>You have no quotes yet.</p>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SidebarInset>
        </>
    );
}

export default function MyQuote() {
    return (
        <SidebarProvider>
            <MyQuoteContent />
        </SidebarProvider>
    );
}
