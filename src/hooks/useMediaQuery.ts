import { useCallback, useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    [query]
  );

  const getMatches = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getMatches, () => false);
};

export const useHasFinePointer = () => useMediaQuery('(pointer: fine)');
