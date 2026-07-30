import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { profile, socialProfiles } from '../data/profile';
import { animatedProps } from '../lib/motion';

const navLinks = [
  { name: 'HOME', path: '/', type: 'route' },
  { name: 'PROJECTS', path: '#projects', type: 'scroll' },
  { name: 'EXPERIENCE', path: '#experience', type: 'scroll' },
  { name: 'CONTACT', path: '#contact', type: 'scroll' },
];

const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

const MENU_PANEL_ID = 'site-menu-panel';

const Navbar = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavigation = (link: typeof navLinks[0]) => {
    setIsOpen(false);
    
    if (link.type === 'route') {
      navigate(link.path);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(link.path);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.querySelector(link.path);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const DURATION = 0.25;
  const STAGGER = 0.025;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <motion.button
        {...animatedProps(prefersReducedMotion, {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.5, duration: 0.4 },
        })}
        onClick={toggleMenu}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all duration-300 cursor-pointer"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls={MENU_PANEL_ID}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: prefersReducedMotion ? 0 : -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: prefersReducedMotion ? 0 : 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: prefersReducedMotion ? 0 : 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: prefersReducedMotion ? 0 : -90, opacity: 0 }}
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: '0%' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={
              prefersReducedMotion
                ? { duration: 0.2 }
                : {
                    type: 'spring',
                    damping: 30,
                    stiffness: 300,
                    mass: 0.8,
                  }
            }
            ref={panelRef}
            id={MENU_PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="fixed top-0 right-0 h-full w-full sm:w-[85vw] md:w-[480px] z-50 bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="h-full flex flex-col justify-between p-6 sm:p-8 md:p-12">

              <nav className="flex-1 flex items-center">
                <ul className="space-y-4 sm:space-y-6 w-full">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      {...animatedProps(prefersReducedMotion, {
                        initial: { opacity: 0, x: 50 },
                        animate: { opacity: 1, x: 0 },
                        transition: {
                          delay: 0.1 + index * 0.1,
                          duration: 0.5,
                          type: 'spring' as const,
                          damping: 20,
                        },
                      })}
                      className="overflow-hidden"
                    >
                      <motion.button
                        onClick={() => handleNavigation(link)}
                        initial="initial"
                        whileHover={prefersReducedMotion ? undefined : 'hovered'}
                        className="cursor-pointer text-left group"
                      >
                        <div
                          className="relative block overflow-hidden whitespace-nowrap text-3xl sm:text-4xl md:text-6xl font-black uppercase text-white"
                          style={{ lineHeight: 0.9 }}
                        >
                          <div>
                            {link.name.split("").map((l, i) => (
                              <motion.span
                                variants={{
                                  initial: { y: 0 },
                                  hovered: { y: "-100%" }
                                }}
                                transition={{
                                  duration: DURATION,
                                  delay: STAGGER * i
                                }}
                                className="inline-block"
                                key={i}
                              >
                                {l}
                              </motion.span>
                            ))}
                          </div>

                          <div className="absolute inset-0">
                            {link.name.split("").map((l, i) => (
                              <motion.span
                                variants={{
                                  initial: { y: "100%" },
                                  hovered: { y: 0 }
                                }}
                                transition={{
                                  duration: DURATION,
                                  delay: STAGGER * i
                                }}
                                className="inline-block text-purple-400"
                                key={i}
                              >
                                {l}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div
                {...animatedProps(prefersReducedMotion, {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.6, duration: 0.5 },
                })}
                className="space-y-6 sm:space-y-8 border-t border-white/10 pt-6 sm:pt-8"
              >
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-block text-sm md:text-base text-slate-400 hover:text-white transition-colors font-mono"
                >
                  {profile.email}
                </a>

                <div className="flex gap-4">
                  {socialProfiles.map(({ href, label }) => {
                    const Icon = socialIcons[label];
                    return (
                    <motion.a
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
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </motion.a>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Available for opportunities</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
