import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { activateOnEnterOrSpace } from '../../lib/keyboard';
import { easing } from '../../lib/motion';
import { useRailFocus } from '../../hooks/useRailFocus';

interface FeaturedDeckProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

const FeaturedDeck = ({ projects, onOpen }: FeaturedDeckProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const applyFocus = useCallback((card: HTMLElement, offset: number) => {
    const distance = Math.min(1, Math.abs(offset));
    const lean = Math.max(-1, Math.min(1, offset));
    card.style.transform = `translateX(${lean * -14}%) rotate(${lean * 9}deg) scale(${1 - distance * 0.16})`;
    card.style.zIndex = String(10 - Math.round(distance * 5));
    card.style.opacity = String(1 - distance * 0.55);
    const image = card.querySelector<HTMLElement>('[data-rail-image]');
    if (image) image.style.transform = `translateX(${Math.max(-1, Math.min(1, offset)) * -14}%) scale(1.3)`;
  }, []);

  const updateFocus = useRailFocus(railRef, applyFocus, !prefersReducedMotion);

  const handleScroll = () => {
    updateFocus();
    const rail = railRef.current;
    if (!rail) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const card = rail.firstElementChild?.nextElementSibling as HTMLElement | null;
      const step = card ? card.offsetWidth + 16 : rail.clientWidth;
      const index = Math.round(rail.scrollLeft / step);
      setActiveIndex(Math.min(projects.length - 1, Math.max(0, index)));
    });
  };

  const scrollToCard = (index: number) => {
    const rail = railRef.current;
    const card = rail?.children[index + 1] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="-mx-5 sm:-mx-8">
      <motion.div
        ref={railRef}
        onScroll={handleScroll}
        role="region"
        aria-label="Featured projects, swipe to browse"
        className="snap-rail relative flex gap-4 overflow-x-auto pt-4 pb-10"
        initial={prefersReducedMotion ? false : { x: 120, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: easing.expo }}
      >
        <div aria-hidden="true" className="w-[calc(14vw-1rem)] flex-shrink-0" />
        {projects.map((project, index) => (
          <article
            key={project.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(project)}
            onKeyDown={activateOnEnterOrSpace(() => onOpen(project))}
            onFocus={() => scrollToCard(index)}
            aria-label={`Open details for ${project.name}`}
            data-rail-card
            style={{ transformOrigin: '50% 120%' }}
            className="relative aspect-[4/5] w-[72vw] max-w-[360px] flex-shrink-0 snap-center overflow-hidden rounded-[28px] border border-white/10 bg-[#141220] active:brightness-90"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={project.image}
                alt=""
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                data-rail-image
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#09080e] via-[#09080e]/55 to-transparent" />
            <div
              className="absolute inset-x-0 top-0 h-1/3 opacity-60"
              style={{ background: `radial-gradient(80% 100% at 0% 0%, ${project.accentColor}66, transparent 70%)` }}
            />

            <span className="absolute left-5 top-5 rounded-full bg-black/55 px-3 py-1 text-xs text-white/85">
              {project.category}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-monument text-[clamp(1.6rem,8.5vw,2.25rem)] font-black uppercase leading-[0.92] tracking-tight text-white [overflow-wrap:anywhere]">
                {project.name}
              </h3>
              <p className="mt-3 text-[15px] text-white/75">{project.subtitle}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
                <span className="inline-block h-px w-6 bg-white" />
                Tap for details
              </p>
            </div>
          </article>
        ))}
        <div aria-hidden="true" className="w-[calc(14vw-1rem)] flex-shrink-0" />
      </motion.div>

      <div className="flex items-center justify-between gap-6 px-5 sm:px-8">
        <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Choose a project">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${project.name}`}
              onClick={() => scrollToCard(index)}
              className="relative h-8 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15">
                <span
                  className={`absolute inset-0 origin-left rounded-full bg-white transition-transform duration-700 ease-expo ${
                    index <= activeIndex ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
        <span className="font-monument text-sm font-black tabular-nums text-white">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="text-white/35"> / {String(projects.length).padStart(2, '0')}</span>
        </span>
      </div>
    </div>
  );
};

export default FeaturedDeck;
