import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ARRIVAL_DROP, CONDENSED_SCALE } from '../lib/motion';

interface SectionArrivalProps {
    children: ReactNode;
    className?: string;
}

const SectionArrival = ({ children, className }: SectionArrivalProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start 0.92', 'start 0.42'],
    });

    const scaleX = useTransform(scrollYProgress, [0, 1], [CONDENSED_SCALE, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [ARRIVAL_DROP, 0]);

    if (prefersReducedMotion) {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{ scaleX, opacity, y, transformOrigin: 'left center' }}
        >
            {children}
        </motion.div>
    );
};

export default SectionArrival;
