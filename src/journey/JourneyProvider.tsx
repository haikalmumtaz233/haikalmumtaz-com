import { useMemo, type ReactNode } from 'react';
import { useScroll } from 'framer-motion';
import { JourneyContext, type JourneyValue } from './useJourney';

const JourneyProvider = ({ children }: { children: ReactNode }) => {
    const { scrollY, scrollYProgress } = useScroll();

    const value = useMemo<JourneyValue>(
        () => ({ scrollY, progress: scrollYProgress }),
        [scrollY, scrollYProgress]
    );

    return <JourneyContext value={value}>{children}</JourneyContext>;
};

export default JourneyProvider;
