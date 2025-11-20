import { useState, useCallback } from 'react';

const LAST_SEARCHES_KEY = 'lastSearches';
const SAVED_SEARCHES_KEY = 'savedSearches';
const MAX_LAST_SEARCHES = 5;

export interface SearchRecord {
    name?: string;
    params: Record<string, string>;
    timestamp: number;
}

export function useSearchHistory() {
    const [lastSearches, setLastSearches] = useState<SearchRecord[]>(() => {
        const stored = localStorage.getItem(LAST_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const [savedSearches, setSavedSearches] = useState<SearchRecord[]>(() => {
        const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const addSearchToHistory = useCallback((params: Record<string, string>) => {
        if (Object.keys(params).length === 0) return;

        setLastSearches(prev => {
            const newSearch: SearchRecord = { params, timestamp: Date.now() };
            const updatedSearches = [newSearch, ...prev.filter(s => JSON.stringify(s.params) !== JSON.stringify(params))];
            const sliced = updatedSearches.slice(0, MAX_LAST_SEARCHES);
            localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(sliced));
            return sliced;
        });
    }, []);

    const saveSearch = useCallback((name: string, params: Record<string, string>) => {
        if (Object.keys(params).length === 0) return;

        setSavedSearches(prev => {
            const newSearch: SearchRecord = { name, params, timestamp: Date.now() };
            const updatedSearches = [...prev.filter(s => s.name !== name), newSearch];
            localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    }, []);

    const deleteSavedSearch = useCallback((name: string) => {
        setSavedSearches(prev => {
            const updatedSearches = prev.filter(s => s.name !== name);
            localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    }, []);
    
    const deleteLastSearch = useCallback((timestamp: number) => {
        setLastSearches(prev => {
            const updatedSearches = prev.filter(s => s.timestamp !== timestamp);
            localStorage.setItem(LAST_SEARCHES_KEY, JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    }, []);


    return {
        lastSearches,
        savedSearches,
        addSearchToHistory,
        saveSearch,
        deleteSavedSearch,
        deleteLastSearch
    };
}
