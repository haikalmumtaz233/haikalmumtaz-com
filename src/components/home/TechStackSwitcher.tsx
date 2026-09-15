import { useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { techCategories } from '../../data/techStack';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const SWIPE_THRESHOLD = 50;

const TechStackSwitcher = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState({ index: 0, direction: 1 });
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = techCategories[active.index];

  const select = (index: number) => {
    const clamped = (index + techCategories.length) % techCategories.length;
    if (clamped === active.index) return;
    setActive({ index: clamped, direction: index > active.index ? 1 : -1 });
    chipRefs.current[clamped]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) select(active.index + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) select(active.index - 1);
  };

  return (
    <div>
      <div className="-mx-5 sm:-mx-8">
        <div
          role="tablist"
          aria-label="Technology areas"
          className="snap-rail relative flex gap-2 overflow-x-auto px-5 pb-2 sm:px-8"
        >
          {techCategories.map((item, index) => {
            const isActive = index === active.index;
            return (
              <button
                key={item.title}
                ref={(node) => {
                  chipRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="tech-stack-panel"
                onClick={() => select(index)}
                className={`relative flex flex-shrink-0 snap-center items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors duration-500 ${
                  isActive ? 'text-black' : 'text-white/65'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId={prefersReducedMotion ? undefined : 'tech-chip'}
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.6, ease: easing.expo }}
                  />
                )}
                {!isActive && <span className="absolute inset-0 rounded-full border border-white/15" />}
                <span className="relative">{item.title}</span>
                <span className={`relative text-xs tabular-nums ${isActive ? 'text-black/50' : 'text-white/35'}`}>
                  {item.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        id="tech-stack-panel"
        role="tabpanel"
        aria-label={category.title}
        className="relative mt-6 overflow-hidden rounded-3xl border border-white/10"
        drag={prefersReducedMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={active.direction}>
          <motion.ul
            key={category.title}
            custom={active.direction}
            className="grid grid-cols-3 gap-px bg-white/10"
            initial="enter"
            animate="center"
            exit="exit"
            variants={{
              enter: { opacity: 1 },
              center: { opacity: 1, transition: { staggerChildren: 0.04 } },
              exit: { opacity: 0, transition: { duration: 0.25 } },
            }}
          >
            {category.items.map((tech) => (
              <motion.li
                key={tech.name}
                custom={active.direction}
                variants={{
                  enter: (dir: number) =>
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: dir * 40, rotate: dir * 8, scale: 0.8 },
                  center: {
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                    scale: 1,
                    transition: { duration: 0.7, ease: easing.expo },
                  },
                }}
                className="flex aspect-square flex-col items-center justify-center gap-3 bg-[#0d0b14] px-2"
              >
                <span className="flex h-9 w-9 items-center justify-center">
                  <TechIcon icon={tech.icon} name={tech.name} />
                </span>
                <span className="text-center text-[13px] leading-tight text-white/75">{tech.name}</span>
              </motion.li>
            ))}
            {Array.from({ length: (3 - (category.items.length % 3)) % 3 }, (_, index) => (
              <li key={`filler-${index}`} aria-hidden="true" className="bg-[#0d0b14]" />
            ))}
          </motion.ul>
        </AnimatePresence>
      </motion.div>

      <p className="mt-4 text-center text-sm text-white/40">Swipe the grid to switch areas</p>
    </div>
  );
};

export default TechStackSwitcher;
