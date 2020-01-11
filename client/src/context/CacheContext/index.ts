/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import get from 'get-value';

export const CacheContext = React.createContext({});

export const useCache = (): any => useContext(CacheContext);

export const getCache = (cacheData: any) => (key: string): any => {
    console.log('Getting value from cache with key ' + key, cacheData);
    return get(cacheData, key);
};

export const setCache = (setFunction: Function) => (key: string, data: any): void => {
    setFunction((state: any) => ({ ...state, [key]: data }));
};

export const clearCache = (setFunction: Function) => (): void => {
    setFunction({});
};

export const clearKey = (setFunction: Function) => (key: string): void => {
    setFunction((state: any) => ({ ...state, [key]: {} }));
};
