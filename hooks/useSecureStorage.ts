import * as SecureStore from 'expo-secure-store';
import { useMemo } from 'react';

export default function useSecureStorage() {
    // Read storage (async) with error handling
    const readStorage = async <T>(key: string): Promise<T | null> => {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error reading key "${key}" from SecureStore:`, error);
            return null;
        }
    };

    // Write storage (async) with error handling
    const writeStorage = async <T>(key: string, value: T): Promise<void> => {
        try {
            await SecureStore.setItemAsync(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing key "${key}" to SecureStore:`, error);
        }
    };

    // Remove a key from storage (async) with error handling
    const removeStorage = async (key: string): Promise<void> => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.error(`Error removing key "${key}" from SecureStore:`, error);
        }
    };

    // Memoize the functions to avoid unnecessary re-renders
    const methods = useMemo(() => ({
        readStorage, writeStorage, removeStorage,
    }), [readStorage, writeStorage, removeStorage]);

    return methods;
}
