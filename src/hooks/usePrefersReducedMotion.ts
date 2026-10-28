import { useReducedMotion } from 'motion/react';

export const usePrefersReducedMotion = (): boolean => useReducedMotion() ?? false;
