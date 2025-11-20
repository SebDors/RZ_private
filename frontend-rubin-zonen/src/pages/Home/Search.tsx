import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { toast } from "sonner";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { SavedSearches } from "@/components/SavedSearches";

function SearchContent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { setOpen, open } = useSidebar();
    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const [diamonds, setDiamonds] = useState<Diamant[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [searchParams, setSearchParams] = useState<Record<string, string>>({});
    const {
        lastSearches,
        savedSearches,
        addSearchToHistory,
        saveSearch,
        deleteSavedSearch,
        deleteLastSearch
    } = useSearchHistory();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paramsAsObject = Object.fromEntries(params.entries());
        if (Object.keys(paramsAsObject).length > 0) {
            setSearchParams(paramsAsObject);
        }
    }, [location.search]);

    const handleSearch = useCallback(async () => {
        try {
            addSearchToHistory(searchParams);
            const diamondsData = await getAllDiamonds(searchParams);
            setDiamonds(diamondsData);
        } catch (error) {
            console.error("Error fetching diamonds:", error);
        }
    }, [searchParams, addSearchToHistory]);

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
    }, [handleSearch]);

    const handleFilterChange = (filterName: string, value: string) => {
        setSearchParams(prev => ({ ...prev, [filterName]: value }));
    };

    const handleReset = () => {
        setSearchParams({});
    };

    const handleSave = () => {
        let name = prompt("Enter a name for this search:");
        if (!name) {
            name = new Date().toLocaleString();
        }
        if (name) {
            saveSearch(name, searchParams);
            toast(`Search "${name}" saved.`);
        }
    };

    const handleSubmit = () => {
        toast("Are you sure you want to submit this search?");
    };

    const handleSideStoneSearch = () => {
        navigate('/side-stone-search', { state: { searchParams } });
    };

    const loadSearch = (params: Record<string, string>) => {
        setSearchParams(params);
    };

    const renderFilter = (filter: Filter) => {
        const isAdmin = user?.is_admin === true;
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
                    value={searchParams[filter.filter_name] || ''}
                />
            </div>
        );
    };
    // TODO version mobile completement cassé
    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="flex">
                    <div className="h-1/2 w-1/4 p-4">
                        <h2 className="text-xl font-bold mb-4">Filters</h2>
                        <ScrollArea className="h-full w-full">
                            <div className="p-4">
                                {filters.map(renderFilter)}
                            </div>
                        </ScrollArea>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <Button onClick={handleSearch}>Search</Button>
                            <Button onClick={handleReset}>Reset</Button>
                            <Button onClick={handleSave}>Save the research</Button>
                            <Button onClick={handleSubmit}>Submit a request</Button>
                            <Button onClick={handleSideStoneSearch} className="col-span-2">Side Stone Search</Button>
                        </div>
                    </div>
                    <div className="h-1/2 w-3/4 p-4 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold mb-4">Diamond List</h2>
                        {/*TODO Ne pas avoir la taille du scroll area en fix */}
                        <ScrollArea className="h-200 w-full">
                            <div className="p-4">
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
                                                <Button onClick={() => navigate(`/stone-detail/${diamond.stock_id}`)} className="mt-4">
                                                    Show Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <SavedSearches
                                title="Last Searches"
                                searches={lastSearches}
                                onLoad={loadSearch}
                                onDelete={(timestamp) => deleteLastSearch(timestamp as number)}
                                deleteIdentifier="timestamp"
                            />
                            <SavedSearches
                                title="Saved Searches"
                                searches={savedSearches}
                                onLoad={loadSearch}
                                onDelete={(name) => deleteSavedSearch(name as string)}
                                deleteIdentifier="name"
                            />
                        </div>
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
