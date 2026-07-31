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

const ENTRY_SCALE = 1.03;
const RECEDE_SCALE = 0.94;
const RECEDE_LIFT = -32;
const PARALLAX_DRIFT = 14;
const FADE_SPAN = 0.5;
const EDGE_OPACITY = 0.9;
const EDGE_HOLD = 0.7;

interface StackRange {
    start: number;
    end: number;
    pinned: boolean;
    stickyTop: number;
}

interface StackMetrics {
    ranges: StackRange[];
    viewport: number;
}

const StackContext = createContext<StackMetrics>({ ranges: [], viewport: 0 });

interface StickyStackProps {
    children: ReactNode;
    className?: string;
}

export const StickyStack = ({ children, className }: StickyStackProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [metrics, setMetrics] = useState<StackMetrics>({ ranges: [], viewport: 0 });

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        let lastWidth = window.innerWidth;

        const measure = () => {
            const viewport = window.innerHeight;
            const items = Array.from(node.children) as HTMLElement[];
            let cursor = node.getBoundingClientRect().top + window.scrollY;

            const ranges = items.map((item, index) => {
                const height = item.offsetHeight;
                const start = cursor;
                cursor += height;

                return {
                    start,
                    end: start + height,
                    pinned: item.dataset.pin === 'true' && index < items.length - 1,
                    stickyTop: Math.min(0, viewport - height),
                };
            });

            setMetrics({ ranges, viewport });
        };

        const handleResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            measure();
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(node);
        Array.from(node.children).forEach((child) => observer.observe(child));
        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <StackContext.Provider value={metrics}>
            <div ref={containerRef} className={className}>
                {children}
            </div>
        </StackContext.Provider>
    );
};

interface StickyStackItemProps {
    index: number;
    id?: string;
    pin?: boolean;
    atmosphere?: ReactNode;
    children: ReactNode;
}

export const StickyStackItem = ({
    index,
    id,
    pin = false,
    atmosphere,
    children,
}: StickyStackItemProps) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const { ranges, viewport } = useContext(StackContext);
    const { scrollY } = useJourney();

    const range = ranges[index];
    const still = prefersReducedMotion || !range;
    const pinned = Boolean(range?.pinned) && !still;
    const covering = Boolean(ranges[index - 1]?.pinned) && !still;

    const span = Math.max(viewport, 1);
    const start = range?.start ?? 0;
    const end = Math.max(range?.end ?? 1, start + 1);
    const enterStart = start - span;
    const recedeStart = Math.max(start, end - span);
    const holds = recedeStart > start;
    const fadeEnd = recedeStart + (end - recedeStart) * FADE_SPAN;
    const entryScale = covering ? ENTRY_SCALE : 1;

    const scaleKeys = pinned
        ? holds
            ? [enterStart, start, recedeStart, end]
            : [enterStart, start, end]
        : [enterStart, start];
    const scaleValues = pinned
        ? holds
            ? [entryScale, 1, 1, RECEDE_SCALE]
            : [entryScale, 1, RECEDE_SCALE]
        : [entryScale, 1];

    const scale = useTransform(scrollY, scaleKeys, scaleValues);
    const opacity = useTransform(scrollY, [recedeStart, fadeEnd], pinned ? [1, 0] : [1, 1]);
    const y = useTransform(scrollY, [recedeStart, end], pinned ? [0, RECEDE_LIFT] : [0, 0]);
    const contentY = useTransform(
        scrollY,
        [recedeStart, end],
        pinned ? [0, PARALLAX_DRIFT] : [0, 0]
    );
    const edgeOpacity = useTransform(
        scrollY,
        [enterStart, enterStart + span * EDGE_HOLD, start],
        [EDGE_OPACITY, EDGE_OPACITY, 0]
    );

    if (still) {
        return (
            <div id={id} data-pin={pin ? 'true' : 'false'} className="relative">
                {atmosphere}
                {children}
            </div>
        );
    }

    return (
        <div
            id={id}
            data-pin={pin ? 'true' : 'false'}
            className={pinned ? 'sticky' : 'relative'}
            style={pinned ? { top: range?.stickyTop ?? 0 } : undefined}
        >
            {covering && (
                <motion.div
                    aria-hidden="true"
                    style={{ opacity: edgeOpacity }}
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-24 md:h-36 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/55 to-transparent"
                />
            )}

            <motion.div
                style={{
                    scale,
                    opacity,
                    y,
                    transformOrigin: holds ? 'center bottom' : 'center top',
                }}
            >
                {atmosphere}
                <motion.div style={{ y: contentY }}>{children}</motion.div>
            </motion.div>
        </div>
    );
};
