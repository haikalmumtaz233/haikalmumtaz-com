import { useReducedMotion } from 'framer-motion';

export const usePrefersReducedMotion = (): boolean => useReducedMotion() ?? false;
