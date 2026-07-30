import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { ChevronDown, Briefcase } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps } from '../../lib/motion';
import Nameplate from './Nameplate';

const roles = ['Application Developer Jr.', 'Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Game Developer'];

const Hero = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(prefersReducedMotion ? roles[0] : '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

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

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentRole = roles[currentRoleIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex, prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen max-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-between py-8 sm:py-12 px-4 sm:px-6"
    >
        <div className="flex-shrink-0 h-20" />

        <div className="flex-grow flex w-full items-center justify-center">
          <div className="w-full text-center">
            <h2 className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-slate-400 mb-4 sm:mb-6">
              MUHAMMAD RADITYA
            </h2>

            <Nameplate scrollProgress={scrollYProgress} />
          </div>
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 pb-6 sm:pb-10">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">

            <AnimatePresence>
              {showScrollIndicator && (
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
              <div className="font-mono text-sm md:text-base">
                <span className="text-purple-500">&gt;</span>{' '}
                <span className="text-white/90">{displayedText}</span>
                <motion.span
                  className="inline-block w-[2px] h-5 bg-purple-500 ml-1"
                  {...animatedProps(prefersReducedMotion, {
                    animate: { opacity: [1, 0, 1] },
                    transition: { duration: 0.8, repeat: Infinity },
                  })}
                />
              </div>
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
  );
};

export default Hero;
