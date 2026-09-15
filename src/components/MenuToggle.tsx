import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../hooks/useMediaQuery';
import { animatedProps, easing } from '../lib/motion';
import MenuPanel, { MENU_PANEL_ID } from './MenuPanel';
import { useJourney } from '../journey/useJourney';

const SECTIONS = [
  { id: 'projects', label: 'Featured work' },
  { id: 'experience', label: 'Experience' },
  { id: 'techstack', label: 'Tech stack' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'favoritemoments', label: 'Moments' },
  { id: 'contact', label: 'Contact' },
];

const useActiveSection = (enabled: boolean) => {
  const [active, setActive] = useState({ index: 0, direction: 1 });

  useEffect(() => {
    if (!enabled) return;

    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = SECTIONS.findIndex(({ id }) => id === entry.target.id);
          if (index < 0) continue;
          setActive((current) =>
            current.index === index ? current : { index, direction: index > current.index ? 1 : -1 }
          );
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
};

const MenuToggle = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  const { progress: scrollYProgress } = useJourney();
  const hasDock = isMobile && pathname === '/';
  const isDockVisible = hasDock && isPastHero;
  const { index: activeIndex, direction } = useActiveSection(hasDock);

  useEffect(() => {
    if (!hasDock) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsPastHero(!entry.isIntersecting),
      { rootMargin: '0px 0px -75% 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [hasDock]);

  const iconMotion = animatedProps(prefersReducedMotion, {
    initial: { opacity: 0, rotate: -45 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 45 },
    transition: { duration: 0.2 },
  });

  const toggleIcon = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={isOpen ? 'close' : 'open'} {...iconMotion} className="flex">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </motion.span>
    </AnimatePresence>
  );

  const toggleProps = {
    type: 'button' as const,
    onClick: () => setIsOpen((open) => !open),
    'aria-label': isOpen ? 'Close menu' : 'Open menu',
    'aria-expanded': isOpen,
    'aria-controls': MENU_PANEL_ID,
  };

  const scrollToTop = () => {
    setIsOpen(false);
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {!isDockVisible && (
          <motion.button
            key="corner-toggle"
            {...toggleProps}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.45, ease: easing.expo }}
            className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:h-14 sm:w-14"
          >
            {toggleIcon}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDockVisible && (
          <motion.div
            key="thumb-dock"
            initial={prefersReducedMotion ? { opacity: 0 } : { y: 120, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: 120, scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8, ease: easing.expo }}
            className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[60] mx-auto flex h-16 max-w-md items-center gap-3 rounded-full border border-white/15 bg-[#09080e] p-2 text-white"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-10 -bottom-px h-[2px] origin-left bg-violet-300"
              style={{ scaleX: scrollYProgress }}
            />
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-white/15 transition-transform duration-300 active:scale-90"
            >
              <span className="font-monument text-[10px] font-black tabular-nums">
                {activeIndex + 1}/{SECTIONS.length}
              </span>
            </button>

            <div className="relative h-7 min-w-0 flex-1 overflow-hidden" aria-live="polite">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.span
                  key={isOpen ? 'menu' : SECTIONS[activeIndex].id}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ y: prefersReducedMotion ? 0 : `${dir * 110}%`, opacity: 0 }),
                    center: { y: '0%', opacity: 1 },
                    exit: (dir: number) => ({ y: prefersReducedMotion ? 0 : `${dir * -110}%`, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: easing.expo }}
                  className="absolute inset-0 flex items-center truncate font-monument text-[15px] font-black uppercase leading-none tracking-tight"
                >
                  {isOpen ? 'Menu' : SECTIONS[activeIndex].label}
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              {...toggleProps}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 active:scale-90"
            >
              {toggleIcon}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <MenuPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MenuToggle;
