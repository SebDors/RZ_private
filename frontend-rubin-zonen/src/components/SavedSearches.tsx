import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export type SavedSearchRecord<TParams = Record<string, unknown>> = {
    name?: string;
    timestamp?: number;
    params: TParams;
    id?: number;
}

interface SavedSearchesProps<TParams extends Record<string, unknown>> {
    title: string;
    searches: SavedSearchRecord<TParams>[];
    onLoad: (params: TParams) => void;
    onDelete: (identifier: string | number) => void;
    deleteIdentifier: 'name' | 'timestamp' | 'id';
}

export function SavedSearches<TParams extends Record<string, unknown>>({ title, searches, onLoad, onDelete, deleteIdentifier }: SavedSearchesProps<TParams>) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSearches = searches.filter(search =>
        (search.name || (search.timestamp ? new Date(search.timestamp).toLocaleString() : '')).toLowerCase().includes(searchTerm.toLowerCase())
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
                            <li key={search.id || search.timestamp || Math.random()} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{search.name || (search.timestamp ? new Date(search.timestamp).toLocaleString() : 'N/A')}</p>
                                    <p className="text-sm text-gray-500">{Object.entries(search.params).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(', ')}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => onLoad(search.params)}>Load</Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDelete(deleteIdentifier === 'name' ? search.name! : search.timestamp as string | number)} >Delete</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
