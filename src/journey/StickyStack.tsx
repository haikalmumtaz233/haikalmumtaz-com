import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { motion, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useJourney } from './useJourney';

const RECEDE_SCALE = 0.94;
const RECEDE_LIFT = -32;
const FADE_SPAN = 0.5;

interface StackRange {
    start: number;
    end: number;
    pinned: boolean;
}

const StackContext = createContext<StackRange[]>([]);

interface StickyStackProps {
    children: ReactNode;
    className?: string;
}

export const StickyStack = ({ children, className }: StickyStackProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ranges, setRanges] = useState<StackRange[]>([]);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const measure = () => {
            const viewport = window.innerHeight;
            const items = Array.from(node.children) as HTMLElement[];
            let cursor = node.getBoundingClientRect().top + window.scrollY;

            setRanges(
                items.map((item, index) => {
                    const height = item.offsetHeight;
                    const start = cursor;
                    cursor += height;

                    return {
                        start,
                        end: start + height,
                        pinned: height <= viewport && index < items.length - 1,
                    };
                })
            );
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(node);
        Array.from(node.children).forEach((child) => observer.observe(child));
        window.addEventListener('resize', measure);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    return (
        <StackContext.Provider value={ranges}>
            <div ref={containerRef} className={className}>
                {children}
            </div>
        </StackContext.Provider>
    );
};

interface StickyStackItemProps {
    index: number;
    id?: string;
    children: ReactNode;
}

export const StickyStackItem = ({ index, id, children }: StickyStackItemProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const ranges = useContext(StackContext);
    const { scrollY } = useJourney();

    const range = ranges[index];
    const start = range?.start ?? 0;
    const end = range ? Math.max(range.end, range.start + 1) : 1;
    const fadeEnd = start + (end - start) * FADE_SPAN;
    const active = Boolean(range?.pinned) && !prefersReducedMotion;

    const scale = useTransform(scrollY, [start, end], [1, RECEDE_SCALE]);
    const opacity = useTransform(scrollY, [start, fadeEnd], [1, 0]);
    const y = useTransform(scrollY, [start, end], [0, RECEDE_LIFT]);

    if (!active) {
        return <div id={id}>{children}</div>;
    }

    return (
        <div id={id} className="sticky top-0">
            <motion.div style={{ scale, opacity, y, transformOrigin: 'center top' }}>
                {children}
            </motion.div>
        </div>
    );
};
