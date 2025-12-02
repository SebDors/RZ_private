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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
    { Name: "Square Emerald", db_value: 'AS' },
    { Name: "Asscher", db_value: 'AS'},
    { Name: "Cushion Modified", db_value: 'CMB' },
    { Name: "Cushion Brilliant", db_value: 'CB' },
    { Name: "Cushion", db_value: 'CU' },
    { Name: "Long Radiant", db_value: 'RA' },
    { Name: "Square Radiant", db_value: 'RA' },
    { Name: "Trilliant", db_value: 'TR' },
    { Name: "Old Mine Cushion", db_value: 'OM' },
    { Name: "Shield", db_value: 'SH' },
    { Name: "Baguette", db_value: 'BAG' },
    { Name: "Trapezoid", db_value: 'TZ' },
    { Name: "Old European Cut", db_value: 'EU' },
    { Name: "Special Shape", db_value: 'SP' },
    { Name: "Rose Cut", db_value: 'RS' },
    // { Name: "Other", db_value: 'null' } // TODO change
];
const colors = ["All", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O-P", "Q-R", "S-T", "U-V", "W-X", "Y-Z", "N-O", "P-R"];
const clarities = [
    { Name: "All", db_value: "All", description: "Select all clarities" },
    { Name: "FL", db_value: "FL", description: "Flawless" },
    { Name: "IF", db_value: "IF", description: "Internally Flawless" },
    { Name: "VVS1", db_value: "VVS1", description: "Very, Very Slightly Included 1" },
    { Name: "VVS2", db_value: "VVS2", description: "Very, Very Slightly Included 2" },
    { Name: "VS1", db_value: "VS1", description: "Very Slightly Included 1" },
    { Name: "VS2", db_value: "VS2", description: "Very Slightly Included 2" },
    { Name: "SI1", db_value: "SI1", description: "Slightly Included 1" },
    { Name: "SI2", db_value: "SI2", description: "Slightly Included 2" },
    { Name: "SI3", db_value: "SI3", description: "Slightly Included 3" },
    { Name: "I1", db_value: "I1", description: "Included 1" },
    { Name: "I2", db_value: "I2", description: "Included 2" },
    { Name: "I3", db_value: "I3", description: "Included 3" },
    { Name: "LC", db_value: "LC", description: "Loupe Clean" }
];
const carats = ["Less than 0.30", "0.30-0.39", "0.40-0.49", "0.50-0.69", "0.70-0.89", "0.90-1.99", "1.00-1.49", "1.50-1.99", "2.00-2.99", "3.00-3.99", "4.00-4.99", "5.00-5.99", "6.00-6.99", "7.00-7.99", "8.00-8.99", "9.00-9.99", "More than 10.00"];
const finishingGrades = [
    { Name: "All", db_value: "All", description: "Select all grades" },
    { Name: "EX", db_value: "EX", description: "Excellent" },
    { Name: "VG", db_value: "VG", description: "Very Good" },
    { Name: "GD", db_value: "GD", description: "Good" },
    { Name: "FR", db_value: "FR", description: "Fair" }
];
const cut = finishingGrades;
const polish = finishingGrades;
const symmetry = finishingGrades;
const fluorescences = [
    { Name: "All", db_value: "All", description: "Select all fluorescences" },
    { Name: "NON", db_value: "NON", description: "None" },
    { Name: "FNT", db_value: "FNT", description: "Faint" },
    { Name: "SLT", db_value: "SLT", description: "Slight" },
    { Name: "VSLT", db_value: "VSLT", description: "Very Slight" },
    { Name: "MED", db_value: "MED", description: "Medium" },
    { Name: "STG", db_value: "STG", description: "Strong" },
    { Name: "VST", db_value: "VST", description: "Very Strong" }
];
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
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [saveSearchName, setSaveSearchName] = useState("");
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
            let allValues: string[] = [];

            // Determine all possible values for the current category
            switch (category) {
                case 'shape':
                    allValues = shapes.map(s => s.db_value);
                    break;
                case 'color':
                    allValues = colors;
                    break;
                case 'clarity':
                    allValues = clarities.map(c => c.db_value);
                    break;
                case 'carat':
                    // carat has custom values in the state based on user input, so "All" behavior needs careful handling.
                    // For simplicity, let's assume "All" for carat means to deselect all carat ranges,
                    // as dynamically added ranges won't be part of a static 'allValues'.
                    // If 'All' is selected, clear all custom carat ranges as well.
                    allValues = carats;
                    break;
                case 'cut':
                    allValues = cut.map(c => c.db_value);
                    break;
                case 'polish':
                    allValues = polish.map(p => p.db_value);
                    break;
                case 'symmetry':
                    allValues = symmetry.map(s => s.db_value);
                    break;
                case 'fluorescence':
                    allValues = fluorescences.map(f => f.db_value);
                    break;
                case 'lab':
                    allValues = labs;
                    break;
                case 'priceRange':
                    allValues = priceRanges;
                    break;
                default:
                    // Should not happen for predefined categories
                    console.warn(`Unknown category: ${category}`);
                    return prev;
            }

            const allOptionValue = (category === 'shape' ? '' : 'All'); // 'All' for strings, '' for shapes
            const isAllClicked = (value === allOptionValue);
            let currentSelection = newSelection[category] || [];

            if (isAllClicked) {
                // If "All" is already selected, deselect all. Otherwise, select all.
                const shouldDeselectAll = currentSelection.includes(allOptionValue);
                newSelection[category] = shouldDeselectAll ? [] : allValues;
            } else {
                // If a specific item is clicked
                if (currentSelection.includes(value)) {
                    // Deselect the item
                    currentSelection = currentSelection.filter(item => item !== value);
                } else {
                    // Select the item
                    currentSelection = [...currentSelection, value];
                }

                // After toggling a specific item, adjust "All" state
                const allExceptAll = allValues.filter(item => item !== allOptionValue);
                const currentSelectionWithoutAll = currentSelection.filter(item => item !== allOptionValue);

                if (currentSelectionWithoutAll.length === allExceptAll.length && allExceptAll.length > 0) {
                    // All individual items are selected, so "All" should be selected too
                    if (!currentSelection.includes(allOptionValue)) {
                        currentSelection = [...currentSelection, allOptionValue];
                    }
                } else {
                    // Not all individual items are selected, so "All" should be deselected
                    currentSelection = currentSelection.filter(item => item !== allOptionValue);
                }
                newSelection[category] = currentSelection;
            }

            return newSelection;
        });
    };

    const handleSearch = useCallback(() => {
        addSearchToHistory(selectedCriteria);
        navigate('/diamond-list', { state: { searchParams: selectedCriteria } });
    }, [selectedCriteria, addSearchToHistory, navigate]);

    const handleSave = () => {
        setIsSaveDialogOpen(true);
    };

    const handleConfirmSave = () => {
        let name = saveSearchName.trim();
        if (!name) {
            name = new Date().toLocaleString();
        }
        saveSearch(name, selectedCriteria);
        setIsSaveDialogOpen(false);
        setSaveSearchName("");
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

    const renderGrid = (title: string, key: string, items: (string | { Name: string; db_value: string | null, description?: string })[]) => (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 grid-flow-row-dense gap-2">
                {items.map(item => {
                    const name = typeof item === 'string' ? item : item.Name;
                    const value = typeof item === 'string' ? item : (item.db_value === null ? '' : item.db_value);
                    const description = typeof item === 'object' && item.description ? item.description : null;

                    if (description) {
                        return (
                            <Tooltip key={name}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={selectedCriteria[key].includes(value) ? "default" : "outline"}
                                        onClick={() => handleSelect(key, value)}
                                    >
                                        {name}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{description}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    }

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
                <div className="p-4 bg-secondary rounded-md h-full">
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

            <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Save Search</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a name for your search. If you leave it empty, the current date and time will be used.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={saveSearchName}
                        onChange={(e) => setSaveSearchName(e.target.value)}
                        placeholder="e.g., My Favorite Search"
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmSave}>Save</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default function QuickSearch() {
    return (
        <SidebarProvider>
            <TooltipProvider>
                <QuickSearchContent />
            </TooltipProvider>
        </SidebarProvider>
    );
}