import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { techCategories } from '../../data/techStack';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const CYCLE_MS = 4500;
const HOVER_INTENT_MS = 180;

const pad = (value: number) => String(value).padStart(2, '0');

const TechStackShowcase = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hoverTimer = useRef<number>();
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
      CYCLE_MS
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
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocusWithin(false);
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
        className="flex flex-col border-t border-white/15"
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
              className="group relative flex items-baseline gap-5 border-b border-white/10 py-4 text-left outline-none focus-visible:bg-white/[0.04] 2xl:py-5"
            >
              <span
                className={`w-6 flex-shrink-0 font-mono text-xs tabular-nums transition-colors duration-500 ${
                  isActive ? 'text-white/70' : 'text-white/30'
                }`}
              >
                {pad(index + 1)}
              </span>
              <span
                className={`flex-1 truncate text-xl font-semibold transition-[color,transform] duration-500 ease-expo lg:text-2xl 2xl:text-[28px] ${
                  isActive ? 'translate-x-2 text-white' : 'text-white/35 group-hover:text-white/70'
                }`}
              >
                {item.title}
              </span>
              <span
                className={`text-sm tabular-nums transition-colors duration-500 ${
                  isActive ? 'text-white/60' : 'text-white/25'
                }`}
              >
                {item.items.length}
              </span>
              {isActive && (
                <motion.span
                  layoutId={prefersReducedMotion ? undefined : 'tech-area-rule'}
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-px overflow-hidden bg-white/30"
                  transition={{ duration: 0.6, ease: easing.expo }}
                >
                  {isCycling && (
                    <motion.span
                      key={activeIndex}
                      className="block h-full origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </motion.span>
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
        className="group/stage relative flex min-h-[340px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b14]/70 p-6 lg:p-8"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/stage:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(168, 85, 247, 0.14), transparent 70%)',
          }}
        />

        <AnimatePresence initial={false}>
          <motion.span
            key={category.title}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[0.18em] left-5 whitespace-nowrap font-monument text-[clamp(3.5rem,8vw,7.5rem)] font-black uppercase leading-none text-white/[0.035] lg:left-7"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: '40%' }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: easing.expo } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {category.title}
          </motion.span>
        </AnimatePresence>

        <span className="relative self-end font-mono text-xs tabular-nums text-white/40">
          {pad(activeIndex + 1)} / {pad(techCategories.length)}
        </span>

        <div className="relative flex flex-1 items-center pt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={category.title}
              className="grid w-full grid-cols-3 gap-3 lg:grid-cols-4 2xl:gap-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.045 } },
                exit: { opacity: 0, transition: { duration: 0.18 } },
              }}
            >
              {category.items.map((tech) => (
                <motion.li
                  key={tech.name}
                  variants={{
                    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.92 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: easing.expo } },
                  }}
                  className="group/tile flex aspect-[4/3] flex-col lg:aspect-square items-center justify-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-2 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.05]"
                >
                  <span className="flex h-10 w-10 items-center justify-center transition-transform duration-500 ease-expo group-hover/tile:-rotate-6 group-hover/tile:scale-110 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
                    <TechIcon icon={tech.icon} name={tech.name} />
                  </span>
                  <span className="w-full truncate text-center text-[13px] text-white/60 transition-colors duration-300 group-hover/tile:text-white lg:text-sm">
                    {tech.name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TechStackShowcase;
