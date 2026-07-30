import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps } from '../../lib/motion';

const currentRole = 'Application Developer · Core Banking COE · BNI via MII';

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasIntroElapsed, setHasIntroElapsed] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const isIntroComplete = hasIntroElapsed || prefersReducedMotion;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const completeTimer = setTimeout(() => {
      setHasIntroElapsed(true);
    }, 2500);

    return () => clearTimeout(completeTimer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY < windowHeight - 100) {
        setShowScrollIndicator(true);
      } else {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isIntroComplete && !prefersReducedMotion && (
          <>
            <motion.div
              className="fixed top-0 left-0 right-0 h-[50vh] bg-white z-50 flex items-end justify-center pb-2 md:pb-8 overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{
                duration: 1.2,
                ease: [0.87, 0, 0.13, 1],
                delay: 0.2
              }}
            >
              <motion.span
                aria-hidden="true"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="block font-sans font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-black uppercase tracking-tighter leading-[0.8]"
              >
                HAIKAL
              </motion.span>
            </motion.div>

            <motion.div
              className="fixed bottom-0 left-0 right-0 h-[50vh] bg-white z-50 flex items-start justify-center pt-2 md:pt-8 overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                duration: 1.2,
                ease: [0.87, 0, 0.13, 1],
                delay: 0.2
              }}
            >
              <motion.span
                aria-hidden="true"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="block font-sans font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-black uppercase tracking-tighter leading-[0.8]"
              >
                MUMTAZ
              </motion.span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative h-screen max-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-between py-8 sm:py-12 px-4 sm:px-6">
        <div className="flex-shrink-0 h-20" />

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-slate-400 mb-4 sm:mb-6">
              MUHAMMAD RADITYA
            </h2>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl font-display font-black uppercase leading-[0.9] tracking-tight text-white">
              <span className="inline-block">HAIKAL</span>{' '}
              <span className="inline-block">MUMTAZ</span>
            </h1>
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 pb-6 sm:pb-10">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">

            <AnimatePresence>
              {showScrollIndicator && isIntroComplete && (
                <motion.div
                  {...animatedProps(prefersReducedMotion, {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 10 },
                    transition: { duration: 0.5, delay: 0.3 },
                  })}
                  className="hidden lg:flex items-center gap-3"
                >
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20"
                    {...animatedProps(prefersReducedMotion, {
                      animate: { y: [0, 6, 0] },
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut' as const,
                      },
                    })}
                  >
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  </motion.div>

                  <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                      Scroll
                    </span>
                    <span className="text-[10px] font-normal uppercase tracking-widest text-slate-400">
                      To Explore
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center">
              <p className="text-data text-center text-white/90">{currentRole}</p>
            </div>

            <div className="flex items-center justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                <Briefcase className="w-4 h-4" />
                Business Inquiries
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
