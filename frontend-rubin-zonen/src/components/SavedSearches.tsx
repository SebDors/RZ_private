import { useState } from "react";
import type { SearchRecord } from "@/hooks/useSearchHistory";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface SavedSearchesProps {
    title: string;
    searches: SearchRecord[];
    onLoad: (params: Record<string, string>) => void;
    onDelete: (identifier: string | number) => void;
    deleteIdentifier: 'name' | 'timestamp';
}

export function SavedSearches({ title, searches, onLoad, onDelete, deleteIdentifier }: SavedSearchesProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSearches = searches.filter(search =>
        (search.name || new Date(search.timestamp).toLocaleString()).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-2"
                />
            </CardHeader>
            <CardContent>
                {filteredSearches.length === 0 ? (
                    <p>No searches found.</p>
                ) : (
                    <ul className="space-y-2">
                        {filteredSearches.map((search) => (
                            <li key={search.timestamp} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{search.name || new Date(search.timestamp).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">{Object.entries(search.params).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => onLoad(search.params)}>Load</Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDelete(deleteIdentifier === 'name' ? search.name! : search.timestamp)}>Delete</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
