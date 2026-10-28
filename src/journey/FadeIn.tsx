import type { ReactNode } from 'react';
import { m } from 'motion/react';
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
    <m.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: easing.expo, delay }}
    >
      {children}
    </m.div>
  );
};

export default FadeIn;
