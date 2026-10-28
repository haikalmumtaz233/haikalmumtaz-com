import { createContext, use } from 'react';
import type { MotionValue } from 'motion/react';

export interface JourneyValue {
    scrollY: MotionValue<number>;
    progress: MotionValue<number>;
}

export const JourneyContext = createContext<JourneyValue | null>(null);

export const useJourney = (): JourneyValue => {
    const value = use(JourneyContext);
    if (!value) {
        throw new Error('useJourney must be used inside JourneyProvider');
    }
    return value;
};
