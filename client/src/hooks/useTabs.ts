import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const useTabs = (initialTab = null): any => {
    const [tab, setTab] = useState<string | null>(initialTab);
    const location = useLocation();

    useEffect(() => {
        //If there is a query param named tab then set that tab
        const params = new URLSearchParams(location.search);
        const tabQuery = params.get('tab');
        if (tabQuery !== undefined) {
            setTab(tabQuery);
        }
    }, [location.search]);

    const handleTabChange = useCallback((e, newValue) => {
        setTab(newValue);
    }, []);

    return Object.assign([tab, handleTabChange, setTab], { tab, handleTabChange, setTab });
};

export default useTabs;
