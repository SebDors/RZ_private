import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useQuickSearch } from '@/hooks/useQuickSearch';
import { SavedSearches } from '@/components/SavedSearches';

const shapes = [
    { Name: "All", db_value: '' },
    { Name: "Round", db_value: 'RD' },
    { Name: "Oval", db_value: 'OV' },
    { Name: "Pear", db_value: 'PS' },
    { Name: "Marquise", db_value: 'MQ' },
    { Name: "Heart", db_value: 'HT' },
    { Name: "Radiant", db_value: 'RA' },
    { Name: "Princess", db_value: 'PC' },
    { Name: "Emerald", db_value: 'EM' },
    { Name: "Square Emerald", db_value: 'SEM' },
    { Name: "Cushion Modified", db_value: 'CMB' },
    { Name: "Cushion Brillant", db_value: 'CB' },
    { Name: "Cushion", db_value: 'CU' },
    { Name: "Long Radiant", db_value: 'LRA' },
    { Name: "Square Radiant", db_value: 'SRA' },
    { Name: "Trilliant", db_value: 'TR' },
    { Name: "Old Mine Cushion", db_value: 'OM' },
    { Name: "Shield", db_value: 'SH' },
    { Name: "Baguette", db_value: 'BAG' },
    { Name: "Traperoid", db_value: 'TP' },
    { Name: "Old European Cut", db_value: 'EU' },
    { Name: "Special Shape", db_value: 'SP' },
    { Name: "Rose Cut", db_value: 'RC' },
    { Name: "Other", db_value: 'null' } // TODO change
];
const colors = ["All", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O-P", "Q-R", "S-T", "U-V", "W-X", "Y-Z", "N-O", "P-R"];
const clarities = ["All", "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "SI3", "I1", "I2"];
const carats = ["Less than 0.30", "0.30-0.39", "0.40-0.49", "0.50-0.69", "0.70-0.89", "0.90-1.99", "1.00-1.49", "1.50-1.99", "2.00-2.99", "3.00-3.99", "4.00-4.99", "5.00-5.99", "6.00-6.99", "7.00-7.99", "8.00-8.99", "9.00-9.99", "More than 10.00"];
const cut = ["EX", "VG", "GD", "FR"];
const polish = ["EX", "VG", "GD", "FR"];
const symmetry = ["EX", "VG", "GD", "FR"];
const fluorescences = ["NON", "FNT", "SLT", "VSLT", "MED", "STG", "VST"];
const labs = ["GIA", "IGI", "HRD"];
const priceRanges = ["0-1000", "1001-5000", "5001-10000", "10001+"];

function QuickSearchContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();
    const [selectedCriteria, setSelectedCriteria] = useState<Record<string, string[]>>({
        shape: [],
        carat: [],
        color: [],
        clarity: [],
        fluorescence: [],
        lab: [],
        priceRange: [],
        cut: [],
        polish: [],
        symmetry: [],
    });
    const [minCarat, setMinCarat] = useState('');
    const [maxCarat, setMaxCarat] = useState('');

    const {
        lastSearches,
        savedSearches,
        addSearchToHistory,
        saveSearch,
        deleteSavedSearch,
        deleteLastSearch
    } = useQuickSearch();

    const loadSearch = (params: Record<string, string[]>) => {
        setSelectedCriteria(params);
    };

    const handleOpen = () => {
        if (!open) {
            setOpen(true);
        }
    };

    const handleSelect = (category: string, value: string) => {
        setSelectedCriteria(prev => {
            const newSelection = { ...prev };
            if (newSelection[category].includes(value)) {
                newSelection[category] = newSelection[category].filter(item => item !== value);
            } else {
                newSelection[category] = [...newSelection[category], value];
            }
            return newSelection;
        });
    };

    const handleSearch = useCallback(() => {
        addSearchToHistory(selectedCriteria);
        navigate('/diamond-list', { state: { searchParams: selectedCriteria } });
    }, [selectedCriteria, addSearchToHistory, navigate]);

    const handleSave = () => {
        let name = prompt("Enter a name for this search:");
        if (!name) {
            name = new Date().toLocaleString();
        }
        if (name) {
            saveSearch(name, selectedCriteria);
        }
    };

    const handleReset = () => {
        setSelectedCriteria({
            shape: [],
            carat: [],
            color: [],
            clarity: [],
            fluorescence: [],
            lab: [],
            priceRange: [],
            cut: [],
            polish: [],
            symmetry: [],
        });
        setMinCarat('');
        setMaxCarat('');
    };

    const handleAddRange = () => {
        const min = parseFloat(minCarat);
        const max = parseFloat(maxCarat);

        if (isNaN(min) || isNaN(max)) {
            toast.error("Please enter valid numbers for carat range.");
            return;
        }
        if (min < 0 || max < 0) {
            toast.error("Carat values cannot be negative.");
            return;
        }
        if (min >= max) {
            toast.error("Max carat must be greater than min carat.");
            return;
        }

        const newRange = `${min}-${max}`;
        if (!selectedCriteria.carat.includes(newRange)) {
            setSelectedCriteria(prev => ({
                ...prev,
                carat: [...prev.carat, newRange]
            }));
        }
        setMinCarat('');
        setMaxCarat('');
    };

    const handleRemoveRange = (rangeToRemove: string) => {
        setSelectedCriteria(prev => ({
            ...prev,
            carat: prev.carat.filter(range => range !== rangeToRemove)
        }));
    };

    const renderGrid = (title: string, key: string, items: (string | { Name: string; db_value: string | null })[]) => (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-11 2xl:grid-cols-12 grid-flow-row-dense gap-2">
                {items.map(item => {
                    const name = typeof item === 'string' ? item : item.Name;
                    const value = typeof item === 'string' ? item : (item.db_value === null ? '' : item.db_value);
                    return (
                        <Button
                            key={name}
                            variant={selectedCriteria[key].includes(value) ? "default" : "outline"}
                            onClick={() => handleSelect(key, value)}
                        >
                            {name}
                        </Button>
                    );
                })}
            </div>
            {key === 'carat' && (
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minCarat}
                            onChange={(e) => setMinCarat(e.target.value)}
                            className="w-24"
                        />
                        <span>-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxCarat}
                            onChange={(e) => setMaxCarat(e.target.value)}
                            className="w-24"
                        />
                        <Button onClick={handleAddRange}>Add Range</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCriteria.carat.filter(range => !carats.includes(range)).map(range => (
                            <Badge key={range} variant="secondary" className="flex items-center gap-1">
                                {range}
                                <button onClick={() => handleRemoveRange(range)} className="ml-1">
                                    <X size={14} />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <Card>
                        <CardContent>
                            {renderGrid("Shape", "shape", shapes)}
                            {renderGrid("Carat", "carat", carats)}
                            {renderGrid("Color", "color", colors)}
                            {renderGrid("Clarity", "clarity", clarities)}
                            {renderGrid("Cut", "cut", cut)}
                            {renderGrid("Polish", "polish", polish)}
                            {renderGrid("Symmetry", "symmetry", symmetry)}
                            {renderGrid("Fluorescence", "fluorescence", fluorescences)}
                            {renderGrid("Lab", "lab", labs)}
                            {renderGrid("Price Range", "priceRange", priceRanges)}
                            <div className="flex justify-end space-x-2 mt-0">
                                <Button onClick={handleReset}>Reset</Button>
                                <Button onClick={handleSave}>Save</Button>
                                <Button onClick={handleSearch}>Search</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <SavedSearches<Record<string, string[]>>
                            title="Last Searches"
                            searches={lastSearches}
                            onLoad={loadSearch}
                            onDelete={(timestamp) => deleteLastSearch(timestamp as number)}
                            deleteIdentifier="timestamp"
                        />
                        <SavedSearches<Record<string, string[]>>
                            title="Saved Searches"
                            searches={savedSearches}
                            onLoad={loadSearch}
                            onDelete={(id) => deleteSavedSearch(id as number)}
                            deleteIdentifier="id"
                        />
                    </div>
                </div>
            </SidebarInset>
        </>
    );
}

export default function QuickSearch() {
    return (
        <SidebarProvider>
            <QuickSearchContent />
        </SidebarProvider>
    );
}