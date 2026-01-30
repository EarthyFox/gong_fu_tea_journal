import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'gongFuTeaJournal_entries';

// Default to undefined to catch context issues early
export const JournalContext = createContext(undefined);

export function JournalProvider({ children }) {
    console.log('JournalProvider mounting');
    // Initialize state lazily from localStorage to prevent overwriting data
    const [entries, setEntries] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error initializing journal entries:', error);
            return [];
        }
    });

    // Save entries to localStorage whenever they change
    useEffect(() => {
        try {
            console.log('Saving entries to storage:', entries.length);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving journal entries:', error);
        }
    }, [entries]);

    const addEntry = (entry) => {
        const newEntry = {
            ...entry,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setEntries((prev) => [newEntry, ...prev]);
        return newEntry.id;
    };

    const updateEntry = (id, updates) => {
        setEntries((prev) =>
            prev.map((entry) =>
                entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
            )
        );
    };

    const deleteEntry = (id) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
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
