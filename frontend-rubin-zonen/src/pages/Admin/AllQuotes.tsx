import { useState, useEffect } from "react";
import { getAllQuotes } from "@/services/quote";
import type { Quote } from "@/services/quote";
import { useRedirectIfNotAdmin } from "@/hooks/useRedirect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function AllQuotesContent() {
    useRedirectIfNotAdmin();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllQuotes = async () => {
            try {
                const allQuotes = await getAllQuotes();
                setQuotes(allQuotes);
            } catch (error) {
                console.error("Error fetching all quotes:", error);
                toast.error("Failed to fetch all quotes.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllQuotes();
    }, []);

    return (
        <div className="p-4 bg-secondary rounded-md h-full">
            <Card>
                <CardHeader>
                    <CardTitle>All Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ScrollArea className="h-[75vh]">
                            <div className="space-y-4">
                                {quotes.length > 0 ? (
                                    quotes.map((quote) => (
                                        <Card key={quote.id}>
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-center">
                                                    <span>Quote #{quote.id} - {quote.user?.first_name} {quote.user?.last_name} ({quote.user?.email})</span>
                                                    <Badge>{quote.status}</Badge>
                                                </CardTitle>
                                                <p className="text-sm text-gray-500">
                                                    Created on: {new Date(quote.created_at).toLocaleDateString()}
                                                </p>
                                            </CardHeader>
                                            <CardContent>
                                                <h4 className="font-semibold">Items:</h4>
                                                <ul className="list-disc pl-5 mt-2">
                                                    {quote.items.map((item, index) => (
                                                        <li key={index}>
                                                            {item.shape} {item.weight}ct, {item.color}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No quotes found.</p>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function AllQuotes() {
    return <AllQuotesContent />;
}
