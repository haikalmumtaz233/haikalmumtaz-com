import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, easing } from '../../lib/motion';
import Nameplate from './Nameplate';

const roles = ['Application Developer Jr.', 'Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Game Developer'];

const EYEBROW_DELAY = 1.05;
const DOCK_DELAY = 1.45;
const DOCK_STAGGER = 0.12;
const TYPING_START_MS = 2100;

const dockItem = (prefersReducedMotion: boolean, order: number) =>
  animatedProps(prefersReducedMotion, {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: easing.expo, delay: DOCK_DELAY + order * DOCK_STAGGER },
  });

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? roles[0] : '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const eyebrowFade = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const eyebrowLift = useTransform(scrollYProgress, [0, 0.18], [0, -24]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < window.innerHeight - 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setIsTyping(true), TYPING_START_MS);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !isTyping) return;

    const currentRole = roles[currentRoleIndex];
    const isComplete = !isDeleting && displayedText.length === currentRole.length;
    const delay = isComplete ? 2200 : isDeleting ? 32 : 55 + Math.random() * 60;

    const timer = setTimeout(() => {
      if (isComplete) {
        setIsDeleting(true);
        return;
      }

      if (!isDeleting) {
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        return;
      }

      if (displayedText.length > 0) {
        setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        return;
      }

      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, isTyping, prefersReducedMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] max-h-[100svh] bg-transparent text-white overflow-hidden flex flex-col items-center justify-between py-8 sm:py-12 px-4 sm:px-6"
    >
        <div className="flex-shrink-0 h-20" />

        <div className="flex-grow flex w-full items-center justify-center">
          <div className="w-full text-center">
            <motion.div style={prefersReducedMotion ? undefined : { opacity: eyebrowFade, y: eyebrowLift }}>
            <motion.h2
              {...animatedProps(prefersReducedMotion, {
                initial: { opacity: 0, letterSpacing: '1.1em' },
                animate: { opacity: 1, letterSpacing: '0.5em' },
                transition: { duration: 1.6, ease: easing.expo, delay: EYEBROW_DELAY },
              })}
              className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-slate-400 mb-4 sm:mb-6 whitespace-nowrap"
            >
              MUHAMMAD RADITYA
            </motion.h2>
            </motion.div>

            <Nameplate scrollProgress={scrollYProgress} />
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 pb-6 sm:pb-10">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="hidden lg:block lg:w-56">
              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    {...dockItem(prefersReducedMotion, 0)}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10, transition: { duration: 0.4 } }}
                    className="flex items-center gap-4"
                  >
                    <span aria-hidden="true" className="relative block h-11 w-px overflow-hidden bg-white/15">
                      <motion.span
                        className="absolute inset-x-0 top-0 h-1/2 bg-white"
                        {...animatedProps(prefersReducedMotion, {
                          initial: { y: '-100%' },
                          animate: { y: '200%' },
                          transition: {
                            duration: 1.8,
                            ease: easing.inout,
                            repeat: Infinity,
                            repeatDelay: 0.4,
                            delay: DOCK_DELAY + 0.8,
                          },
                        })}
                      />
                    </span>

                    <span className="flex flex-col leading-none">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                        Scroll
                      </span>
                      <span className="mt-1 text-[10px] font-normal uppercase tracking-widest text-slate-400">
                        To Explore
                      </span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div {...dockItem(prefersReducedMotion, 1)} className="flex items-center justify-center">
              <div className="font-mono text-sm md:text-base" aria-live="off">
                <span className="text-purple-500">&gt;</span>{' '}
                <span className="text-white/90">{displayedText}</span>
                <motion.span
                  aria-hidden="true"
                  className="inline-block w-[0.55em] h-[1.1em] -mb-[0.2em] bg-purple-500/80 ml-1"
                  {...animatedProps(prefersReducedMotion, {
                    animate: { opacity: [1, 1, 0, 0] },
                    transition: {
                      duration: 1.05,
                      times: [0, 0.5, 0.5, 1],
                      ease: 'linear' as const,
                      repeat: Infinity,
                    },
                  })}
                />
              </div>
            </motion.div>

            <motion.div {...dockItem(prefersReducedMotion, 2)} className="flex items-center justify-center lg:w-56 lg:justify-end">
              <a
                href="#contact"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-purple-500/20 isolate"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-purple-200 transition-transform duration-500 ease-expo group-hover:scale-y-100"
                />
                <Briefcase className="w-4 h-4 transition-transform duration-500 ease-expo group-hover:-rotate-12" />
                Business Inquiries
              </a>
            </motion.div>

          </div>
        </div>
    </section>
  );
};

export default Hero;
