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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Clock, ShoppingCart, Download, FileText, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper component to render the detail rows using theme colors
const DetailRow = ({ 
    label1, 
    value1, 
    label2, 
    value2, 
    className 
}: { 
    label1: string, 
    value1: string | number | undefined | null, 
    label2?: string, 
    value2?: string | number | undefined | null,
    className?: string
}) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-4 border-b border-border last:border-0 text-sm", className)}>
        <div className="bg-muted/50 p-2 font-semibold text-muted-foreground flex items-center">
            {label1}
        </div>
        <div className="p-2 flex items-center border-r border-border bg-card text-foreground">
            {value1 || "-"}
        </div>
        {label2 && (
            <>
                <div className="bg-muted/50 p-2 font-semibold text-muted-foreground flex items-center border-t border-border md:border-t-0">
                    {label2}
                </div>
                <div className="p-2 flex items-center bg-card text-foreground border-t border-border md:border-t-0">
                    {value2 || "-"}
                </div>
            </>
        )}
    </div>
);

function StoneDetailContent() {
    useRedirectIfNotAuth();
    const { stock_id } = useParams<{ stock_id: string }>();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();
    const [diamond, setDiamond] = useState<Diamant | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("cert");
    const [imageLoadError, setImageLoadError] = useState(false);
    const [videoLoadError, setVideoLoadError] = useState(false);

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
                    
                    // Determine initial active tab based on availability
                    if (diamondData.certificate_file) setActiveTab("cert");
                    else if (diamondData.diamond_image || diamondData.image_file) setActiveTab("image");
                    else if (diamondData.video_file) setActiveTab("video");
                    
                } catch (error) {
                    console.error("Error fetching diamond details:", error);
                    toast.error("Could not load diamond details.");
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
                await addItemToCart(stock_id);
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

    const handleExport = () => {
        toast.info("Exporting to Excel...", {
            description: "This feature will be available soon."
        });
    };

    // Reset error states when diamond changes or tab changes
    useEffect(() => {
        setImageLoadError(false);
        setVideoLoadError(false);
    }, [diamond, activeTab]);

    if (loading) {
        return (
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[600px] w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!diamond) {
        return <div className="p-8 text-center text-lg text-muted-foreground">Diamond not found.</div>;
    }

    // Safely parse numbers from the diamond data to avoid .toFixed errors
    const pricePerCarat = diamond.price_carat ? parseFloat(String(diamond.price_carat)) : 0;
    const weight = diamond.weight ? parseFloat(String(diamond.weight)) : 0;
    const totalAmount = (pricePerCarat && weight) ? (pricePerCarat * weight) : 0;
    const imageUrl = diamond.diamond_image || diamond.image_file;

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4 md:p-6 bg-muted/20 min-h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* LEFT COLUMN: Media (Cert, Image, Video) */}
                        <Card className="h-full flex flex-col overflow-hidden border-border bg-card">
                            <CardContent className="p-0 flex-1 flex flex-col h-full">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full">
                                    <div className="flex-1 bg-muted/30 relative min-h-[500px] lg:min-h-0 flex items-center justify-center">
                                        
                                        {/* Certificate Tab */}
                                        <TabsContent value="cert" className="m-0 h-full w-full absolute inset-0 bg-background">
                                            {diamond.certificate_file ? (
                                                <object 
                                                    data={diamond.certificate_file} 
                                                    type="application/pdf"
                                                    className="w-full h-full border-0" 
                                                    title="Certificate"
                                                >
                                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                                        <span>Certificate failed to load. Please contact the seller.</span>
                                                    </div>
                                                </object>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    <span>No Certificate Available</span>
                                                </div>
                                            )}
                                        </TabsContent>

                                        {/* Image Tab */}
                                        <TabsContent value="image" className="m-0 h-full w-full absolute inset-0 bg-background">
                                            {imageUrl && !imageLoadError ? (
                                                <img 
                                                    src={imageUrl} 
                                                    alt="Diamond" 
                                                    className="w-full h-full object-contain" 
                                                    onError={() => setImageLoadError(true)}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    {imageUrl && imageLoadError ? (
                                                        <span>Image failed to load. Please contact the seller.</span>
                                                    ) : (
                                                        <span>No Image Available</span>
                                                    )}
                                                </div>
                                            )}
                                        </TabsContent>

                                        {/* Video Tab */}
                                        <TabsContent value="video" className="m-0 h-full w-full absolute inset-0 bg-background">
                                            {diamond.video_file && !videoLoadError ? (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <video 
                                                        controls 
                                                        src={diamond.video_file} 
                                                        className="max-h-full max-w-full"
                                                        onError={() => setVideoLoadError(true)}
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                                    {diamond.video_file && videoLoadError ? (
                                                        <span>Video failed to load. Please contact the seller.</span>
                                                    ) : (
                                                        <span>No Video Available</span>
                                                    )}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </div>

                                    {/* Tabs Navigation */}
                                    <div className="border-t border-border bg-card">
                                        <TabsList className="w-full justify-start rounded-none h-12 bg-card p-0">
                                            {diamond.certificate_file && (
                                                <TabsTrigger 
                                                    value="cert" 
                                                    className="h-full px-6 data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Certificate
                                                </TabsTrigger>
                                            )}
                                            {imageUrl && (
                                                <TabsTrigger 
                                                    value="image" 
                                                    className="h-full px-6 data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                                                >
                                                    <ImageIcon className="w-4 h-4 mr-2" />
                                                    Image
                                                </TabsTrigger>
                                            )}
                                            {diamond.video_file && (
                                                <TabsTrigger 
                                                    value="video" 
                                                    className="h-full px-6 data-[state=active]:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-muted-foreground data-[state=active]:text-foreground"
                                                >
                                                    <Video className="w-4 h-4 mr-2" />
                                                    Video
                                                </TabsTrigger>
                                            )}
                                        </TabsList>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* RIGHT COLUMN: Stone Detail */}
                        <Card className="h-full border-t-4 border-t-primary border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                                <CardTitle className="text-xl font-normal text-foreground">Stone Detail</CardTitle>
                                <div className="flex space-x-2">
                                    <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToWatchlist} title="Add to Watchlist">
                                        <Clock className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleAddToCart} title="Add to Cart">
                                        <ShoppingCart className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleExport} title="Export to Excel">
                                        <Download className="h-4 w-4" />
                                        {/* TODO envoyer le mail */}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-8">
                                
                                {/* BASIC DETAILS */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wide">Basic Details</h3>
                                    <div className="border border-border rounded-sm overflow-hidden">
                                        <DetailRow label1="Stone ID" value1={diamond.stock_id} label2="Shape" value2={diamond.shape} />
                                        <DetailRow label1="Lab" value1={diamond.lab} label2="Certificate No" value2={diamond.certificate_number} />
                                        <DetailRow label1="Carat" value1={diamond.weight} label2="Color" value2={diamond.color} />
                                        <DetailRow label1="Clarity" value1={diamond.clarity} label2="" value2="" />
                                    </div>
                                </div>

                                {/* PRICE DETAILS */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wide">Price Details</h3>
                                    <div className="border border-border rounded-sm overflow-hidden">
                                        <DetailRow label1="Rap Price" value1={diamond.rap_price || "-"} label2="Disc %" value2={diamond.discount || "-"} />
                                        <DetailRow 
                                            label1="Pr/Ct" 
                                            value1={pricePerCarat ? pricePerCarat.toFixed(2) : "-"} 
                                            label2="Stone Amount" 
                                            value2={totalAmount ? totalAmount.toFixed(2) : "-"} 
                                        />
                                    </div>
                                </div>

                                {/* MAKE DETAILS */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wide">Make Details</h3>
                                    <div className="border border-border rounded-sm overflow-hidden">
                                        <DetailRow label1="Cut" value1={diamond.cut_grade} label2="Polish" value2={diamond.polish} />
                                        <DetailRow label1="Symmetry" value1={diamond.symmetry} label2="Fluorescence" value2={diamond.fluorescence_intensity} />
                                    </div>
                                </div>

                                {/* PARAMETER DETAILS */}
                                <div>
                                    <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2 tracking-wide">Parameter Details</h3>
                                    <div className="border border-border rounded-sm overflow-hidden">
                                        <DetailRow label1="Measurement" value1={diamond.measurements} label2="Table %" value2={diamond.table_pct || "-"} />
                                        <DetailRow label1="Depth%" value1={diamond.depth_pct || "-"} label2="Ratio" value2={diamond.ratio || "-"} />
                                        <DetailRow label1="Crown Angle" value1={diamond.crown_angle || "-"} label2="Crown Height" value2={diamond.crown_height || "-"} />
                                        <DetailRow label1="Pavilion Angle" value1={diamond.pavilion_angle || "-"} label2="Pv. Depth" value2={diamond.pavilion_depth || "-"} />
                                        <DetailRow label1="Girdle%" value1={diamond.girdle || "-"} label2="Star Length" value2={diamond.star_length || "-"} />
                                        <DetailRow label1="Lower Half" value1={diamond.lower_half || "-"} label2="" value2="" />
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
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