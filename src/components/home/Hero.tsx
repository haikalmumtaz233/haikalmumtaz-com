import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, easing } from '../../lib/motion';
import { useIntroGate } from '../../lib/intro';
import Nameplate from './Nameplate';

const roles = ['Application Developer Jr.', 'Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Game Developer'];

const EYEBROW_DELAY = 1.05;
const DOCK_DELAY = 1.45;
const DOCK_STAGGER = 0.12;
const TYPING_START = 2.1;
const INTRO_LEAD = 0.75;

const dockItem = (prefersReducedMotion: boolean, order: number, ready: boolean, lead: number) =>
  animatedProps(prefersReducedMotion, {
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, ease: easing.expo, delay: DOCK_DELAY - lead + order * DOCK_STAGGER },
  });

const RoleTicker = ({ startDelay, ready }: { startDelay: number; ready: boolean }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? roles[0] : '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || !ready) return;
    const timer = setTimeout(() => setIsTyping(true), startDelay * 1000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion, startDelay, ready]);

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
    <div className="font-mono text-sm md:text-base min-h-[1.5em]" aria-live="off">
      <span className="text-purple-400">&gt;</span>{' '}
      <span className="text-white/90">{displayedText}</span>
      <motion.span
        aria-hidden="true"
        className="inline-block w-[0.55em] h-[1.1em] -mb-[0.2em] bg-purple-400/80 ml-1"
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
  );
};

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { gated, ready } = useIntroGate();
  const lead = gated ? INTRO_LEAD : 0;
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(scrollY, 'change', (value) => {
    setShowScrollIndicator(value < window.innerHeight - 100);
  });

  const eyebrowFade = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const eyebrowLift = useTransform(scrollYProgress, [0, 0.18], [0, -24]);

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
            <motion.p
              {...animatedProps(prefersReducedMotion, {
                initial: { opacity: 0, letterSpacing: '1.1em' },
                animate: ready ? { opacity: 1, letterSpacing: '0.5em' } : { opacity: 0, letterSpacing: '1.1em' },
                transition: { duration: 1.6, ease: easing.expo, delay: EYEBROW_DELAY - lead },
              })}
              className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-white/55 mb-4 sm:mb-6 whitespace-nowrap"
            >
              MUHAMMAD RADITYA
            </motion.p>
          </motion.div>

          <Nameplate scrollProgress={scrollYProgress} />
        </div>
      </div>

      <div className="shell pb-4 sm:pb-8">
        <div className="flex flex-col items-center gap-5 lg:grid lg:grid-cols-3 lg:items-center">
          <div className="hidden lg:block">
            <AnimatePresence>
              {showScrollIndicator && (
                <motion.div
                  {...dockItem(prefersReducedMotion, 0, ready, lead)}
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
                          delay: DOCK_DELAY - lead + 0.8,
                        },
                      })}
                    />
                  </span>
                  <span className="text-sm text-white/60">Scroll to explore</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div {...dockItem(prefersReducedMotion, 1, ready, lead)} className="flex justify-center">
            <RoleTicker startDelay={TYPING_START - lead} ready={ready} />
          </motion.div>

          <motion.div {...dockItem(prefersReducedMotion, 2, ready, lead)} className="flex justify-center lg:justify-end">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-semibold text-black isolate"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-purple-200 transition-transform duration-500 ease-expo group-hover:scale-y-100"
              />
              Get in touch
              <ArrowDownRight className="w-4 h-4 transition-transform duration-500 ease-expo group-hover:-rotate-45" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
