import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'gongFuTeaJournal_entries';

// Default to undefined to catch context issues early
export const JournalContext = createContext(undefined);

export function JournalProvider({ children }) {
    const [entries, setEntries] = useState([]);
    const { user } = useAuth();

    // Fetch entries when user logs in
    useEffect(() => {
        if (user) {
            api.get('/entries')
                .then(data => setEntries(data))
                .catch(err => console.error("Failed to fetch entries", err));
        } else {
            setEntries([]);
        }
    }, [user]);

    const addEntry = async (entry) => {
        if (!user) return;
        try {
            const result = await api.post('/entries', entry);
            // Re-fetch or append locally. Ideally re-fetch or use returned ID.
            // For now, let's append what we have + the ID.
            const newEntry = { ...entry, id: result.id, createdAt: new Date().toISOString() };
            setEntries((prev) => [newEntry, ...prev]);
            return result.id;
        } catch (error) {
            console.error("Failed to add entry", error);
            throw error;
        }
    };

    const updateEntry = async (id, updates) => {
        if (!user) return;
        try {
            const result = await api.put(`/entries/${id}`, updates);
            setEntries((prev) =>
                prev.map((entry) =>
                    // Use 'updates' to ensure we have the frontend-friendly format (e.g. teaName vs name)
                    // Merge result.entry only for server-generated fields if needed (like updatedAt),
                    // but be careful not to overwrite flat fields with raw DB fields.
                    // Safest is to just trust 'updates' for the UI and perhaps update timestamp.
                    entry.id === id ? { ...entry, ...updates, updatedAt: result.entry.updated_at } : entry
                )
            );
            return result.entry;
        } catch (error) {
            console.error("Failed to update entry", error);
            throw error;
        }
    };

    const deleteEntry = async (id) => {
        if (!user) return;
        try {
            await api.delete(`/entries/${id}`);
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
        } catch (error) {
            console.error("Failed to delete entry", error);
        }
    };

    const getEntry = (id) => {
        return entries.find((entry) => entry.id === id);
    };

    const value = {
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
    };

    return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
    const context = useContext(JournalContext);
    if (context === undefined) {
        throw new Error('useJournal must be used within a JournalProvider');
    }
    return context;
}
