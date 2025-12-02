import { useState, useEffect } from "react";
import { getAllQuotes, deleteQuote, updateQuoteStatus } from "@/services/quote";
import type { Quote } from "@/services/quote";
import { useRedirectIfNotAdmin } from "@/hooks/useRedirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AllQuotesContent() {
    useRedirectIfNotAdmin();
    const navigate = useNavigate();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [quoteToDeleteId, setQuoteToDeleteId] = useState<number | null>(null);

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

    useEffect(() => {
        fetchAllQuotes();
    }, []);

    const handleConfirmDelete = async () => {
        if (quoteToDeleteId) {
            try {
                await deleteQuote(quoteToDeleteId);
                toast.success("Quote deleted successfully.");
                fetchAllQuotes(); // Refresh the list
            } catch (error) {
                console.error("Error deleting quote:", error);
                toast.error("Failed to delete quote.");
            } finally {
                setIsAlertDialogOpen(false);
                setQuoteToDeleteId(null);
            }
        }
    };

    const handleRemoveClick = (id: number) => {
        setQuoteToDeleteId(id);
        setIsAlertDialogOpen(true);
    };

    const handleStatusChange = async (quoteId: number, newStatus: string) => {
        try {
            await updateQuoteStatus(quoteId, newStatus);
            toast.success("Quote status updated.");
            fetchAllQuotes(); // Refresh the list
        } catch (error) {
            console.error("Error updating quote status:", error);
            toast.error("Failed to update quote status.");
        }
    };

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
                                                    <div>
                                                        <span>Quote #{quote.id} - {quote.user?.first_name} {quote.user?.last_name} ({quote.user?.email})</span>
                                                        <Button variant="link" onClick={() => navigate(`/admin/clients/${quote.user?.id}`)}>Client Details</Button>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Select onValueChange={(value) => handleStatusChange(quote.id, value)} defaultValue={quote.status}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pending</SelectItem>
                                                                <SelectItem value="approved">Approved</SelectItem>
                                                                <SelectItem value="rejected">Rejected</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button variant="destructive" size="sm" onClick={() => handleRemoveClick(quote.id)} className="ml-4">
                                                            Remove
                                                        </Button>
                                                    </div>
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
                                                            Stock ID: {item.stock_id}, Shape: {item.shape}, Weight: {item.weight}ct, Color: {item.color}, Clarity: {item.clarity}, Price/Carat: ${item.price_carat}
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

            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the quote and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AllQuotes() {
    return <AllQuotesContent />;
}
