import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

const FadeIn = ({ children, className, delay = 0.7 }: FadeInProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: easing.expo, delay }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
