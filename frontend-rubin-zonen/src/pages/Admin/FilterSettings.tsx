import { useState, useEffect } from "react";
import { getAllFilters, updateFilter } from "@/services/filters";
import type { Filter } from "@/models/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function FilterSettings() {
    const [filters, setFilters] = useState<Filter[]>([]);

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

    const handleFilterToggle = async (filterName: string, isEnabled: boolean) => {
        try {
            const updatedFilter = await updateFilter(filterName, isEnabled);
            setFilters(prevFilters =>
                prevFilters.map(f =>
                    f.filter_name === updatedFilter.filter_name ? updatedFilter : f
                )
            );
        } catch (error) {
            console.error(`Error updating filter ${filterName}:`, error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Filter Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filters.map(filter => (
                        // TODO fix the cursor pointer that work 
                        <div key={filter.filter_name} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                id={filter.filter_name}
                                checked={filter.is_enabled}
                                onCheckedChange={(checked) => handleFilterToggle(filter.filter_name, !!checked)}
                            />
                            <Label htmlFor={filter.filter_name} className="capitalize">
                                {filter.filter_name.replace(/_/g, ' ')}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
