import { useMemo, type ReactNode } from 'react';
import {
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { JourneyContext, type JourneyValue } from './useJourney';

const VELOCITY_SCALE = 1400;

const clamp = (value: number, min: number, max: number) =>
    value < min ? min : value > max ? max : value;

const JourneyProvider = ({ children }: { children: ReactNode }) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const still = useMotionValue(0);

    const { scrollY, scrollYProgress } = useScroll();
    const rawVelocity = useVelocity(scrollY);

    const normalizedVelocity = useTransform(rawVelocity, (value) =>
        clamp(value / VELOCITY_SCALE, -1, 1)
    );

    const smoothVelocity = useSpring(normalizedVelocity, {
        stiffness: 240,
        damping: 42,
        mass: 0.6,
    });

    const warp = useTransform(scrollY, (value) =>
        clamp(value / Math.max(window.innerHeight, 1), 0, 1)
    );

    const value = useMemo<JourneyValue>(
        () => ({
            progress: scrollYProgress,
            velocity: prefersReducedMotion ? still : smoothVelocity,
            warp: prefersReducedMotion ? still : warp,
        }),
        [scrollYProgress, smoothVelocity, warp, still, prefersReducedMotion]
    );

    return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
};

export default JourneyProvider;
