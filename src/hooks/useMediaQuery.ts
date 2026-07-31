import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() =>
        typeof window === 'undefined' ? false : window.matchMedia(query).matches
    );

    useEffect(() => {
        const list = window.matchMedia(query);
        const handleChange = () => setMatches(list.matches);

        handleChange();
        list.addEventListener('change', handleChange);

        return () => list.removeEventListener('change', handleChange);
    }, [query]);

    return matches;
};
