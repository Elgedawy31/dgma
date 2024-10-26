import { useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useStorage() {
    const readStorage = async (key: string) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.log('Error retrieving value: ', error);
        }
    };

    const writeStorage = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log('Error storing value: ', error);
        }
    };

    const removeStorage = async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('Error deleting value: ', error);
        }
    }
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Error clear storage: ', error);
        }
    }

    const methods = useMemo(() => ({
        readStorage, writeStorage, removeStorage, clearStorage
    }), [readStorage, writeStorage, removeStorage, clearStorage])

    return methods;
}
/*
import { useMemo } from 'react';
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()
export default function useStorage() {
    const readStorage = (key: string) => {
        try {
            return storage.getString(key);
        } catch (error) {
            console.log('Error retrieving value: ', error);
        }
    };

    const writeStorage = (key: string, value: string) => {
        try {
            storage.set(key, value);
        } catch (error) {
            console.log('Error storing value: ', error);
        }
    };

    const removeItem = async (key: string) => {
        try {
            storage.delete(key);
            // await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('Error deleting value: ', error);
        }
    }
    const clearStorage = async () => {
        try {
            storage.clearAll();
            // await AsyncStorage.clear();
        } catch (error) {
            console.log('Error clear storage: ', error);
        }
    }

    const methods = useMemo(() => ({
        readStorage, writeStorage, removeItem, clearStorage
    }), [readStorage, writeStorage, removeItem, clearStorage])

    return methods;
}
*/