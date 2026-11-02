import { useRef, type KeyboardEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';
import type { Project } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

interface FeaturedTabsProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const FeaturedTabs = ({ projects, activeIndex, onSelect }: FeaturedTabsProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keyMap: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: projects.length - 1,
    };
    const next = keyMap[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const clamped = Math.min(projects.length - 1, Math.max(0, next));
    onSelect(clamped);
    tabRefs.current[clamped]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Featured projects"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      className="panel flex h-full flex-col gap-1 rounded-2xl p-2"
    >
      {projects.map((project, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={project.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`featured-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="featured-preview"
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(index)}
            className="group relative flex w-full flex-auto flex-col justify-center rounded-xl px-5 py-2.5 text-left xl:py-4"
          >
            {isActive && (
              <m.span
                layoutId={prefersReducedMotion ? undefined : 'featured-active-row'}
                aria-hidden="true"
                className="absolute inset-0 rounded-xl border border-white/15 bg-white/8"
                transition={{ duration: 0.6, ease: easing.expo }}
              />
            )}
            <span
              className={`relative block font-monument text-base font-black uppercase leading-tight tracking-tight transition-colors duration-500 xl:text-lg 2xl:text-xl ${
                isActive ? 'text-white' : 'text-white/75 group-hover:text-white'
              }`}
            >
              {project.name}
            </span>
            <AnimatePresence initial={false}>
              {isActive && (
                <m.span
                  className="relative block overflow-hidden"
                  initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: easing.expo }}
                >
                  <span className="block pt-2 text-[15px] text-white/85">{project.subtitle}</span>
                  <span className="mt-1 flex items-center gap-2 text-sm text-white/80">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: project.accentColor }}
                    />
                    {project.category}
                  </span>
                </m.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
};

export default FeaturedTabs;
