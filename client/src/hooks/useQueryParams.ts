import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type useQueryParamsType = {
    [key: string]: string;
};

const useQueryParams = (initialTab = ''): useQueryParamsType => {
    const [ params, setParams ] = useState({});
    const location = useLocation();

    useEffect(() => {
        //If there is a query param named tab then set that tab
        const Qparams = new URLSearchParams(location.search);
        setParams(Qparams);
    }, [location.search]);

    return params;
};

export default useQueryParams;
