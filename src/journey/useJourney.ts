import { createContext, useContext } from 'react';
import type { MotionValue } from 'framer-motion';

export interface JourneyValue {
    progress: MotionValue<number>;
    velocity: MotionValue<number>;
    warp: MotionValue<number>;
}

export const JourneyContext = createContext<JourneyValue | null>(null);

export const useJourney = (): JourneyValue => {
    const value = useContext(JourneyContext);
    if (!value) {
        throw new Error('useJourney must be used inside JourneyProvider');
    }
    return value;
};
