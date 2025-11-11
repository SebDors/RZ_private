import { useState, useEffect } from "react";
import { getAllDiamonds } from "@/services/diamonds";
import { getAllFilters } from "@/services/filters";
import type { Diamant, Filter } from "@/models/models";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SearchContent() {
    const { user, loading: userLoading } = useAuth();
    const { setOpen, open } = useSidebar();
    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [searchParams, setSearchParams] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const filtersData = await getAllFilters();
                setFilters(filtersData);
            } catch (error) {
                console.error("Error fetching filters:", error);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        try {
            const diamondsData = await getAllDiamonds(searchParams);
            setDiamonds(diamondsData);
        } catch (error) {
            console.error("Error fetching diamonds:", error);
        }
    };

    const handleFilterChange = (filterName: string, value: string) => {
        setSearchParams(prev => ({ ...prev, [filterName]: value }));
    };

    const renderFilter = (filter: Filter) => {
        const isAdmin = user?.role === 'admin';
        if (!isAdmin && !filter.is_enabled) {
            return null;
        }

        const isDisabled = isAdmin && !filter.is_enabled;

        // Simplified version with inputs, will be improved with selects later
        return (
            <div key={filter.filter_name} className={`${isDisabled ? 'opacity-50' : ''}`}>
                <Label htmlFor={filter.filter_name} className="capitalize mt-2 text-lg">{filter.filter_name.replace(/_/g, ' ')}</Label>
                <Input
                    id={filter.filter_name}
                    name={filter.filter_name}
                    disabled={isDisabled}
                    onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
                />
            </div>
        );
    };

    if (userLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex">
                    <div className="w-1/4 p-4 border-r">
                        <h2 className="text-xl font-bold mb-4">Filters</h2>
                        <ScrollArea className="h-[80vh]">
                            {filters.map(renderFilter)}
                        </ScrollArea>
                        <Button onClick={handleSearch} className="w-full mt-4">Search</Button>
                    </div>
                    <div className="w-3/4 p-4">
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
    );
}

export default function Search() {
    return (
        <SidebarProvider>
            <SearchContent />
        </SidebarProvider>
    );
}
