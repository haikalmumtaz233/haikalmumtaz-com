import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';

type Align = 'left' | 'center';

interface RuleRevealProps {
    lines: string[];
    as?: 'h1' | 'h2';
    className?: string;
    align?: Align;
    delay?: number;
}

const RULE_DURATION = 1.5;
const RISE_OFFSET = 0.28;
const LINE_STAGGER = 0.09;

const ruleFrames: Record<Align, string[]> = {
    left: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0%)', 'inset(0 0% 0 100%)'],
    center: ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)', 'inset(0 0% 0 0%)', 'inset(0 50% 0 50%)'],
};

const RuleReveal = ({ lines, as = 'h2', className = '', align = 'left', delay = 0 }: RuleRevealProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const ref = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });
    const Tag = as;
    const lastIndex = lines.length - 1;

    if (prefersReducedMotion) {
        return (
            <Tag className={className}>
                {lines.map((line) => (
                    <span key={line} className="block">
                        {line}
                    </span>
                ))}
            </Tag>
        );
    }

    return (
        <Tag ref={ref} className={className}>
            {lines.map((line, index) => (
                <span key={line} className="block">
                    <span className="relative inline-block overflow-hidden align-top pb-[0.12em] -mb-[0.12em] px-[0.08em] -mx-[0.08em]">
                        <motion.span
                            className="block"
                            initial={{ y: '110%' }}
                            animate={isInView ? { y: '0%' } : undefined}
                            transition={{
                                duration: 1,
                                ease: easing.expo,
                                delay: delay + RISE_OFFSET + index * LINE_STAGGER,
                            }}
                        >
                            {line}
                        </motion.span>
                        {index === lastIndex && (
                            <motion.span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/70"
                                initial={{ clipPath: ruleFrames[align][0] }}
                                animate={isInView ? { clipPath: ruleFrames[align] } : undefined}
                                transition={{
                                    duration: RULE_DURATION,
                                    delay,
                                    times: [0, 0.36, 0.62, 1],
                                    ease: [easing.wipe, 'linear', easing.wipe],
                                }}
                            />
                        )}
                    </span>
                </span>
            ))}
        </Tag>
    );
};

export default RuleReveal;
