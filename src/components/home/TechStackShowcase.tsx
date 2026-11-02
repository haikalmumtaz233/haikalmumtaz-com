import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { AnimatePresence, m, stagger, useInView } from 'motion/react';
import { techCategories } from '../../data/techStack';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const CYCLE_MS = 4500;
const HOVER_INTENT_MS = 180;

const TechStackShowcase = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const isInView = useInView(containerRef, { amount: 0.4 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const category = techCategories[activeIndex];
  const isCycling = isInView && !isHovered && !hasFocusWithin && !prefersReducedMotion;

  useEffect(() => {
    if (!isCycling) return;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % techCategories.length),
      CYCLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isCycling, activeIndex]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const scheduleSelect = (index: number) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setActiveIndex(index), HOVER_INTENT_MS);
  };

  const cancelSelect = () => window.clearTimeout(hoverTimer.current);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (activeIndex + step + techCategories.length) % techCategories.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setHasFocusWithin(false);
  };

  const handleStagePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    stage.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    stage.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      ref={containerRef}
      className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocusWithin(true)}
      onBlur={handleBlur}
    >
      <div
        role="tablist"
        aria-label="Technology areas"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        className="panel flex flex-col gap-1 rounded-2xl p-2"
      >
        {techCategories.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.title}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="tech-stack-stage"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onPointerEnter={() => scheduleSelect(index)}
              onPointerLeave={cancelSelect}
              className={`group relative flex items-baseline gap-5 overflow-hidden rounded-xl px-4 py-3.5 text-left transition-colors duration-500 2xl:py-4 ${isActive ? 'bg-white/8' : 'hover:bg-white/4'}`}
            >
              <span
                className={`flex-1 truncate text-xl font-semibold transition-[color,transform] duration-500 ease-expo lg:text-2xl 2xl:text-[28px] ${
                  isActive ? 'translate-x-1 text-white' : 'text-white/70 group-hover:text-white'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`text-sm tabular-nums transition-colors duration-500 ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}
              >
                {item.items.length}
              </span>
              {isActive && (
                <m.span
                  layoutId={prefersReducedMotion ? undefined : 'tech-area-rule'}
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-0 h-px overflow-hidden bg-white/25"
                  transition={{ duration: 0.6, ease: easing.expo }}
                >
                  {isCycling && (
                    <m.span
                      key={activeIndex}
                      className="block h-full origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </m.span>
              )}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        id="tech-stack-stage"
        role="tabpanel"
        aria-label={category.title}
        onPointerMove={handleStagePointerMove}
        className="panel group/stage relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl p-6 lg:p-8"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/stage:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(168, 85, 247, 0.14), transparent 70%)',
          }}
        />

        <span className="relative font-mono text-xs tracking-[0.2em] text-white/70 uppercase">
          {category.title}
        </span>

        <div className="relative flex flex-1 items-center pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <m.ul
              key={category.title}
              className="grid w-full grid-cols-3 gap-3 lg:grid-cols-4 2xl:gap-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { delayChildren: stagger(0.045) } },
                exit: { opacity: 0, transition: { duration: 0.18 } },
              }}
            >
              {category.items.map((tech) => (
                <m.li
                  key={tech.name}
                  variants={{
                    hidden: prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 18, scale: 0.92 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.7, ease: easing.expo },
                    },
                  }}
                  className="group/tile flex aspect-4/3 flex-col lg:aspect-square items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/4 px-2 transition-colors duration-300 hover:border-white/35 hover:bg-white/8"
                >
                  <span className="flex h-10 w-10 items-center justify-center transition-transform duration-500 ease-expo group-hover/tile:-rotate-6 group-hover/tile:scale-110 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
                    <TechIcon icon={tech.icon} name={tech.name} />
                  </span>
                  <span className="w-full truncate text-center text-[13px] text-white/80 transition-colors duration-300 group-hover/tile:text-white lg:text-sm">
                    {tech.name}
                  </span>
                </m.li>
              ))}
            </m.ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TechStackShowcase;
