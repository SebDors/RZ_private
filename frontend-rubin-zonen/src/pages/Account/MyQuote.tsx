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
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/export";
import { getDiamondById } from "@/services/diamonds";
import { Spinner } from "@/components/ui/spinner";

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

    const handleExport = async () => {
        if (quotes.length === 0) {
            toast.error("No quotes to export.");
            return;
        }

        try {
            setLoading(true);
            const allItems = quotes.flatMap(quote => quote.items.map(item => ({...item, quote_id: quote.id, quote_status: quote.status})));
            const detailedItems = await Promise.all(
                allItems.map(item => getDiamondById(item.stock_id).then(diamond => ({...diamond, ...item})))
            );

            const dataToExport = detailedItems.map(d => ({
                "Quote ID": d.quote_id,
                "Quote Status": d.quote_status,
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

            exportToExcel(dataToExport, "quotes");
        } catch (error) {
            toast.error("Could not export quote details.");
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
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">My Quotes</h2>
                        <Button onClick={handleExport}>Export to Excel</Button>
                    </div>
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
