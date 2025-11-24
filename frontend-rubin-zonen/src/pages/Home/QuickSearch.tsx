import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllDiamonds } from '@/services/diamonds';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

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
    { Name: "Asscher", db_value: 'AS'},
    { Name: "Cushion Modified", db_value: 'CMB' },
    { Name: "Cushion Brilliant", db_value: 'CB' },
    { Name: "Cushion", db_value: 'CU' },
    { Name: "Long Radiant", db_value: 'LRA' },
    { Name: "Square Radiant", db_value: 'SRA' },
    { Name: "Trilliant", db_value: 'TR' },
    { Name: "Old Mine Cushion", db_value: 'OM' },
    { Name: "Shield", db_value: 'SH' },
    { Name: "Baguette", db_value: 'BAG' },
    { Name: "Trapezoid", db_value: 'TP' },
    { Name: "Old European Cut", db_value: 'EU' },
    { Name: "Special Shape", db_value: 'SP' },
    { Name: "Rose Cut", db_value: 'RC' },
];

const caratRanges = ["0.30-0.399", "0.40-0.499", "0.50-0.699", "0.70-0.899", "0.90-0.999", "1.00-1.49", "1.50-1.99", "2.00-2.99", "3.00-3.99", "4.00-4.99", "5.00-5.99", "6.00-7.99", "8.00-9.99", "10.00+"];

const colorClarityRows = [
    { color: 'DEF', clarity: 'FL-IF' }, { color: 'DEF', clarity: 'VVS' }, { color: 'DEF', clarity: 'VS' },
    { color: 'DEF', clarity: 'SI' }, { color: 'DEF', clarity: 'I' }, { color: 'GHI', clarity: 'FL-IF' },
    { color: 'GHI', clarity: 'VVS' }, { color: 'GHI', clarity: 'VS' }, { color: 'GHI', clarity: 'SI' },
    { color: 'GHI', clarity: 'I' }, { color: 'J-', clarity: 'FL-IF' }, { color: 'J-', clarity: 'VVS' },
    { color: 'J-', clarity: 'VS' }, { color: 'J-', clarity: 'SI' }, { color: 'J-', clarity: 'I' },
];

const colorMap: Record<string, string[]> = {
    'DEF': ['D', 'E', 'F'], 'GHI': ['G', 'H', 'I'],
    'J-': ['J', 'K', 'L', 'M', 'N', 'O-P', 'Q-R', 'S-T', 'U-V', 'W-X', 'Y-Z', 'N-O', 'P-R']
};

const clarityMap: Record<string, string[]> = {
    'FL-IF': ['FL', 'IF'], 'VVS': ['VVS1', 'VVS2'], 'VS': ['VS1', 'VS2'],
    'SI': ['SI1', 'SI2', 'SI3'], 'I': ['I1', 'I2']
};

interface CellIdentifier { color: string; clarity: string; carat: string; }

function QuickSearchContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();

    const [selectedShape, setSelectedShape] = useState<string>('RD');
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCells, setSelectedCells] = useState<Record<string, CellIdentifier>>({});
    const [hoveredColorGroup, setHoveredColorGroup] = useState<string | null>(null);

    useEffect(() => {
        const fetchCounts = async () => {
            setIsLoading(true);
            const shapeName = shapes.find(s => s.db_value === selectedShape)?.Name || 'All';
            const loadingToastId = toast.loading(`Fetching data for ${shapeName} diamonds...`);

            const promises = [];
            for (const row of colorClarityRows) {
                for (const carat of caratRanges) {
                    const filters: Record<string, string> = {
                        shape: selectedShape,
                        color: colorMap[row.color].join(','),
                        clarity: clarityMap[row.clarity].join(',')
                    };
                    
                    // --- FIX: Send the carat filter as a single range string ---
                    // This aligns the API call with the format used in handleSearch.
                    if (carat === "10.00+") {
                        filters.carat = "10.00-99.00"; 
                    } else {
                        filters.carat = carat; 
                    }
                    
                    const key = `${row.color}-${row.clarity}-${carat}`;
                    promises.push(
                        getAllDiamonds(filters)
                            .then(data => ({ key, count: data.length }))
                            .catch(() => ({ key, count: 0 }))
                    );
                }
            }

            const results = await Promise.all(promises);
            const newCounts = results.reduce((acc, { key, count }) => {
                acc[key] = count;
                return acc;
            }, {} as Record<string, number>);
            
            setCounts(newCounts);
            setIsLoading(false);
            toast.dismiss(loadingToastId);
        };

        fetchCounts();
    }, [selectedShape]);

    const handleCellToggle = (cell: CellIdentifier, cellKey: string) => {
        setSelectedCells(prev => {
            const newSelection = { ...prev };
            if (newSelection[cellKey]) {
                delete newSelection[cellKey];
            } else {
                newSelection[cellKey] = cell;
            }
            return newSelection;
        });
    };

    const handleSearch = () => {
        const criteria = Object.values(selectedCells);
        if (criteria.length === 0) {
            toast.error("Please select at least one cell to search.");
            return;
        }

        const searchParams: Record<string, string[]> = {
            shape: [selectedShape], carat: [], color: [], clarity: [],
        };

        const caratSet = new Set<string>();
        const colorSet = new Set<string>();
        const claritySet = new Set<string>();

        criteria.forEach(cell => {
            const caratRange = cell.carat === '10.00+' ? '10.00-99.00' : cell.carat;
            caratSet.add(caratRange);
            colorMap[cell.color]?.forEach(c => colorSet.add(c));
            clarityMap[cell.clarity]?.forEach(c => claritySet.add(c));
        });

        searchParams.carat = Array.from(caratSet);
        searchParams.color = Array.from(colorSet);
        searchParams.clarity = Array.from(claritySet);

        navigate('/diamond-list', { state: { searchParams } });
    };

    const handleReset = () => setSelectedCells({});
    const handleOpen = () => { if (!open) setOpen(true); };

    const colorGroups = useMemo(() => {
        return colorClarityRows.reduce((acc, row) => {
            if (!acc[row.color]) acc[row.color] = [];
            acc[row.color].push(row);
            return acc;
        }, {} as Record<string, typeof colorClarityRows>);
    }, []);

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Shape</h3>
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 grid-flow-row-dense gap-2">
                                    {shapes.map(shape => (
                                        <Button
                                            key={shape.db_value}
                                            variant={selectedShape === shape.db_value ? "default" : "outline"}
                                            onClick={() => setSelectedShape(shape.db_value)}
                                        >
                                            {shape.Name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative border rounded-md">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-10">
                                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    </div>
                                )}
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Color</TableHead>
                                            <TableHead className="w-[100px]">Clarity</TableHead>
                                            {caratRanges.map(carat => (
                                                <TableHead key={carat} className="text-center">{carat}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(colorGroups).map(([color, rows]) => (
                                            rows.map((row, rowIndex) => (
                                                <TableRow 
                                                    key={`${row.color}-${row.clarity}`}
                                                    onMouseEnter={() => setHoveredColorGroup(color)}
                                                    onMouseLeave={() => setHoveredColorGroup(null)}
                                                >
                                                    {rowIndex === 0 && (
                                                        <TableCell 
                                                            rowSpan={rows.length} 
                                                            className={cn( "align-middle font-semibold text-center transition-colors",
                                                                { "bg-accent": hoveredColorGroup === color }
                                                            )}
                                                        >
                                                            {color}
                                                        </TableCell>
                                                    )}
                                                    <TableCell className="font-medium">{row.clarity}</TableCell>
                                                    {caratRanges.map(carat => {
                                                        const key = `${row.color}-${row.clarity}-${carat}`;
                                                        const count = counts[key];
                                                        const isChecked = !!selectedCells[key];
                                                        const currentCell = { color: row.color, clarity: row.clarity, carat };

                                                        return (
                                                            <TableCell key={key} className="text-center">
                                                                <div className='flex items-center justify-center space-x-2'>
                                                                    <Checkbox
                                                                        id={key}
                                                                        checked={isChecked}
                                                                        onCheckedChange={() => handleCellToggle(currentCell, key)}
                                                                        disabled={!count || count === 0}
                                                                    />
                                                                    <label htmlFor={key} className="cursor-pointer">
                                                                        {count !== undefined ? (count > 0 ? count : '-') : ''}
                                                                    </label>
                                                                </div>
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={handleReset}>Reset Selection</Button>
                                <Button onClick={handleSearch}>Search</Button>
                            </div>
                        </CardContent>
                    </Card>
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