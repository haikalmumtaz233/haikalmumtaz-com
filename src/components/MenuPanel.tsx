import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { m, AnimatePresence } from 'motion/react';
import { useLenis } from 'lenis/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { profile, socialProfiles } from '../data/profile';
import BrandIcon from './ui/BrandIcon';
import MenuSky from './MenuSky';
import { animatedProps, easing } from '../lib/motion';

const navLinks = [
  { name: 'Home', path: '/', type: 'route' },
  { name: 'Projects', path: '#projects', type: 'scroll' },
  { name: 'Experience', path: '#experience', type: 'scroll' },
  { name: 'Contact', path: '#contact', type: 'scroll' },
];

export const MENU_PANEL_ID = 'site-menu-panel';

const LETTER_DURATION = 0.5;
const LETTER_STAGGER = 0.025;
const MAX_WAIT_FRAMES = 120;

const whenRendered = (selector: string, run: () => void, framesLeft = MAX_WAIT_FRAMES) => {
  if (document.querySelector(selector) || framesLeft === 0) {
    requestAnimationFrame(() => requestAnimationFrame(run));
    return;
  }
  requestAnimationFrame(() => whenRendered(selector, run, framesLeft - 1));
};

export interface MenuOrigin {
  right: number;
  top: number;
  reach: number;
}

const portal = (origin: MenuOrigin, radius: number) =>
  `circle(${radius}px at calc(100% - ${origin.right}px) ${origin.top}px)`;

interface MenuPanelProps {
  isOpen: boolean;
  origin: MenuOrigin;
  onClose: () => void;
}

const MenuPanel = ({ isOpen, origin, onClose }: MenuPanelProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();

  const scrollToTarget = (target: string | number, immediate = false) => {
    if (lenis) {
      lenis.start();
      lenis.resize();
      lenis.scrollTo(target, { immediate });
      return;
    }

    const behavior = prefersReducedMotion || immediate ? 'auto' : 'smooth';
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior });
      return;
    }
    document.querySelector(target)?.scrollIntoView({ behavior });
  };

  const handleNavigation = (link: (typeof navLinks)[0]) => {
    onClose();

    const target = link.type === 'route' ? 0 : link.path;

    if (location.pathname !== '/') {
      const isRoute = link.type === 'route';
      navigate('/', { viewTransition: isRoute, state: { skipScrollRestore: true } });
      whenRendered(isRoute ? '#hero' : link.path, () => scrollToTarget(target, isRoute));
      return;
    }

    scrollToTarget(target);
  };

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflowY;
    document.body.style.overflowY = 'hidden';
    lenis?.stop();

    return () => {
      document.body.style.overflowY = previous;
      lenis?.start();
    };
  }, [isOpen, lenis]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={prefersReducedMotion ? { opacity: 0 } : { clipPath: portal(origin, 0) }}
            animate={
              prefersReducedMotion ? { opacity: 1 } : { clipPath: portal(origin, origin.reach) }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    clipPath: portal(origin, 0),
                    transition: { duration: 0.6, ease: easing.inout },
                  }
            }
            transition={
              prefersReducedMotion ? { duration: 0.2 } : { duration: 0.95, ease: easing.wipe }
            }
            ref={panelRef}
            id={MENU_PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="fixed top-0 right-0 h-full w-full sm:w-[85vw] md:w-[480px] z-50 bg-[#09080e] border-l border-white/10 shadow-2xl overflow-hidden"
          >
            <MenuSky />
            <div className="relative h-full flex flex-col justify-between p-6 pb-28 sm:p-8 sm:pb-28 md:p-12">
              <nav className="flex-1 flex items-center">
                <ul className="relative grid gap-4 sm:gap-6 w-full">
                  <m.span
                    aria-hidden="true"
                    {...animatedProps(prefersReducedMotion, {
                      initial: { scaleY: 0 },
                      animate: { scaleY: 1 },
                      transition: { delay: 0.3, duration: 1.2, ease: easing.expo },
                    })}
                    className="absolute left-[3px] top-[0.45em] bottom-[0.45em] w-px origin-top bg-linear-to-b from-violet-300/60 via-white/20 to-sky-300/40 text-3xl sm:text-4xl md:text-[3.5rem]"
                  />
                  {navLinks.map((link, index) => (
                    <li key={link.name} className="group flex items-center gap-5 sm:gap-6">
                      <m.span
                        aria-hidden="true"
                        {...animatedProps(prefersReducedMotion, {
                          initial: { scale: 0, opacity: 0 },
                          animate: { scale: 1, opacity: 1 },
                          transition: {
                            delay: 0.4 + index * 0.09,
                            duration: 0.9,
                            ease: easing.expo,
                          },
                        })}
                        className="relative flex size-[7px] shrink-0"
                      >
                        <span className="size-full rounded-full bg-white/70 shadow-[0_0_8px_rgba(196,181,253,0.7)] transition-transform duration-500 ease-expo group-hover:scale-[1.9] group-has-focus-visible:scale-[1.9]" />
                      </m.span>
                      <div className="overflow-hidden">
                        <m.div
                          {...animatedProps(prefersReducedMotion, {
                            initial: { y: '115%', rotate: 4 },
                            animate: { y: '0%', rotate: 0 },
                            transition: {
                              delay: 0.22 + index * 0.07,
                              duration: 1,
                              ease: easing.expo,
                            },
                          })}
                          className="origin-bottom-left"
                        >
                          <m.button
                            type="button"
                            aria-label={link.name}
                            onClick={() => handleNavigation(link)}
                            initial="initial"
                            whileHover={prefersReducedMotion ? undefined : 'hovered'}
                            className="cursor-pointer text-left group"
                          >
                            <div
                              aria-hidden="true"
                              className="relative block overflow-hidden whitespace-nowrap text-3xl sm:text-4xl md:text-[3.5rem] font-black uppercase text-white"
                              style={{ lineHeight: 0.9 }}
                            >
                              <div>
                                {link.name.split('').map((l, i) => (
                                  <m.span
                                    variants={{
                                      initial: { y: 0 },
                                      hovered: { y: '-100%' },
                                    }}
                                    transition={{
                                      duration: LETTER_DURATION,
                                      ease: easing.expo,
                                      delay: LETTER_STAGGER * i,
                                    }}
                                    className="inline-block"
                                    key={i}
                                  >
                                    {l}
                                  </m.span>
                                ))}
                              </div>

                              <div className="absolute inset-0">
                                {link.name.split('').map((l, i) => (
                                  <m.span
                                    variants={{
                                      initial: { y: '100%' },
                                      hovered: { y: 0 },
                                    }}
                                    transition={{
                                      duration: LETTER_DURATION,
                                      ease: easing.expo,
                                      delay: LETTER_STAGGER * i,
                                    }}
                                    className="inline-block text-violet-300"
                                    key={i}
                                  >
                                    {l}
                                  </m.span>
                                ))}
                              </div>
                            </div>
                          </m.button>
                        </m.div>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>

              <m.div
                {...animatedProps(prefersReducedMotion, {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.55, duration: 0.9, ease: easing.expo },
                })}
                className="relative grid justify-items-start gap-6 sm:gap-8 border-t border-white/10 pt-6 sm:pt-8"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-block text-sm md:text-base text-slate-400 hover:text-white transition-colors font-mono"
                >
                  {profile.email}
                </a>

                <div className="flex gap-4">
                  {socialProfiles.map(({ href, label }) => (
                    <m.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      {...animatedProps(prefersReducedMotion, {
                        whileHover: { scale: 1.1, rotate: 5 },
                        whileTap: { scale: 0.95 },
                      })}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                      aria-label={label}
                    >
                      <BrandIcon
                        brand={label}
                        className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors"
                      />
                    </m.a>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available for opportunities</span>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuPanel;
