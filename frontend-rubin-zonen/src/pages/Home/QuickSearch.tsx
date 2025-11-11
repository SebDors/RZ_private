import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useRedirectIfNotAuth } from "@/hooks/useRedirect";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const shapes = ["Round", "Princess", "Cushion", "Oval", "Emerald", "Pear", "Marquise", "Asscher", "Radiant", "Heart"];
const colors = ["D", "E", "F", "G", "H", "I", "J"];
const clarities = ["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"];
const carats = ["0.3-0.4", "0.5-0.6", "0.7-0.8", "0.9-1.0", "1.1-1.5", "1.6-2.0", "2.1-3.0"];

function QuickSearchContent() {
    useRedirectIfNotAuth();
    const navigate = useNavigate();
    const { setOpen, open } = useSidebar();
    const [selectedCriteria, setSelectedCriteria] = useState<Record<string, string[]>>({
        shape: [],
        color: [],
        clarity: [],
        carat: [],
    });

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

    const handleSearch = () => {
        navigate('/diamond-list', { state: { searchParams: selectedCriteria } });
    };

    const handleReset = () => {
        setSelectedCriteria({
            shape: [],
            color: [],
            clarity: [],
            carat: [],
        });
    };

    const renderGrid = (title: string, items: string[]) => (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="grid grid-cols-7 gap-2">
                {items.map(item => (
                    <Button
                        key={item}
                        variant={selectedCriteria[title.toLowerCase()].includes(item) ? "default" : "outline"}
                        onClick={() => handleSelect(title.toLowerCase(), item)}
                    >
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <AppSidebar onClick={handleOpen} className="cursor-pointer" />
            <SidebarInset>
                <Header />
                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Search</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderGrid("Shape", shapes)}
                            {renderGrid("Color", colors)}
                            {renderGrid("Clarity", clarities)}
                            {renderGrid("Carat", carats)}
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button onClick={handleReset}>Reset</Button>
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