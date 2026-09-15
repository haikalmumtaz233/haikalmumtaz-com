import { useCallback, useSyncExternalStore } from 'react';

export const MOBILE_QUERY = '(max-width: 767px)';

export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
