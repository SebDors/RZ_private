import { useState, useEffect, useCallback } from 'react';
import { getSavedSearches, saveSearch as apiSaveSearch, deleteSavedSearch as apiDeleteSearch } from '@/services/savedSearches';
import type { SavedSearchRecord } from '@/components/SavedSearches'; // New import
import { toast } from 'sonner';

const LAST_QUICK_SEARCHES_KEY = 'lastQuickSearches';

export const useQuickSearch = () => {
    const [lastSearches, setLastSearches] = useState<{ params: Record<string, string[]>; timestamp: number }[]>([]);
    const [savedSearches, setSavedSearches] = useState<SavedSearchRecord<Record<string, string[]>>[]>([]); // Use SavedSearchRecord

    useEffect(() => {
        // Load last searches from local storage
        const storedLastSearches = localStorage.getItem(LAST_QUICK_SEARCHES_KEY);
        if (storedLastSearches) {
            setLastSearches(JSON.parse(storedLastSearches));
        }

        // Load saved searches from DB
        fetchSavedSearches();
    }, []);

    const fetchSavedSearches = async () => {
        try {
            const searches = await getSavedSearches(); // No type parameter
            // Map SavedSearch to SavedSearchRecord
            setSavedSearches(searches.map(s => ({
                id: s.id,
                name: s.name,
                params: s.search_params, // Map search_params to params
                created_at: s.created_at,
                // user_id and search_type are not needed for display in SavedSearchRecord
            })));
        } catch (error) {
            console.error("Failed to fetch saved searches:", error);
            // Don't toast here, it can be annoying on page load
        }
    };

    const addSearchToHistory = useCallback((searchParams: Record<string, string[]>) => {
        if (Object.values(searchParams).every(val => Array.isArray(val) && val.length === 0)) {
            return;
        }
        setLastSearches(prev => {
            const newHistory = [{ params: searchParams, timestamp: Date.now() }, ...prev];
            if (newHistory.length > 5) {
                newHistory.pop();
            }
            localStorage.setItem(LAST_QUICK_SEARCHES_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const saveSearch = useCallback(async (name: string, searchParams: Record<string, string[]>) => {
        try {
            await apiSaveSearch(name, searchParams); // No type parameter
            toast(`Search "${name}" saved.`);
            fetchSavedSearches(); // Refresh list
        } catch (error) {
            console.error("Failed to save search:", error);
            toast.error("Failed to save search.");
        }
    }, []);

    const deleteLastSearch = useCallback((timestamp: number) => {
        setLastSearches(prev => {
            const newHistory = prev.filter(search => search.timestamp !== timestamp);
            localStorage.setItem(LAST_QUICK_SEARCHES_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const deleteSavedSearch = useCallback(async (id: number) => {
        try {
            await apiDeleteSearch(id);
            toast("Saved search deleted.");
            setSavedSearches(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Failed to delete saved search:", error);
            toast.error("Failed to delete saved search.");
        }
    }, []);

    const loadSearch = (params: Record<string, string[]>) => {
        // This function will be passed to the component to set its state.
        // The actual implementation will be in the component itself.
        console.log("Loading search params:", params);
    };

    return { lastSearches, savedSearches, addSearchToHistory, saveSearch, deleteLastSearch, deleteSavedSearch, loadSearch };
};
