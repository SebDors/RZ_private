import { useState, useEffect } from "react";
import { getAllDiamonds } from "@/services/diamonds";
import type { Diamant } from "@/models/models";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import Header from "@/components/Header"
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";

function DiamondListContent() {
    useRedirectIfNotAuth();

    const { setOpen, open } = useSidebar()
    const handleOpen = () => {
        if (!open) {
            setOpen(true)
        }
    }

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);

    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                const diamonds = await getAllDiamonds();
                setDiamonds(diamonds);
            } catch (error) {
                console.error("Error fetching diamonds:", error);
            }
        };

        fetchDiamonds();
    }, []);

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 ml-2 mr-2 rounded-lg"> 
                    {/* TODO fix the bottom of the screen */}
                    <div className="w-full max-w-4xl">
                        <h2 className="text-2xl font-bold mb-4">Diamond List</h2>
                        <ScrollArea className="h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {diamonds.map((diamond) => (
                                    <Card key={diamond.stock_id}>
                                        <CardHeader>
                                            <CardTitle>{diamond.shape} {diamond.weight}ct</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Color: {diamond.color}</p>
                                            <p>Clarity: {diamond.clarity}</p>
                                            <p>Price/Carat: ${diamond.price_carat}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}

export default function DiamondList() {
    return (
        <SidebarProvider>
            <DiamondListContent />
        </SidebarProvider>
    )
}