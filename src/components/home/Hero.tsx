import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown, Briefcase } from 'lucide-react';

const Hero = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showBlob, setShowBlob] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const roles = ['Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Game Developer'];

  useEffect(() => {
    const blobTimer = setTimeout(() => {
      setShowBlob(true);
    }, 1000);

    const completeTimer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2400);

    return () => {
      clearTimeout(blobTimer);
      clearTimeout(completeTimer);
    };
  }, []);

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

  // Typewriter effect
  useEffect(() => {
    if (!isIntroComplete) return;

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
  }, [isIntroComplete, displayedText, isDeleting, currentRoleIndex]);




  return (
    <>
      {/* ========== CINEMATIC SPLIT-SCREEN REVEAL ========== */}
      <AnimatePresence>
        {!isIntroComplete && (
          <>
            {/* TOP PANEL */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-[50vh] bg-white z-50 flex items-end justify-center pb-12 overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
              }}
            >
              <motion.h1
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.1
                }}
                className="font-monument font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black uppercase tracking-tighter leading-none"
              >
                HAIKAL
              </motion.h1>
            </motion.div>

            {/* CENTER ENERGY BLOB */}
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: showBlob ? [0, 1.5, 2] : 0, 
                opacity: showBlob ? [0, 1, 0] : 0 
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.5, 1]
              }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-400 blur-xl" />
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/80" />
            </motion.div>

            {/* BOTTOM PANEL */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 h-[50vh] bg-white z-50 flex items-start justify-center pt-12 overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                duration: 0.8, 
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2
              }}
            >
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.1
                }}
                className="font-monument font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black uppercase tracking-tighter leading-none"
              >
                MUMTAZ
              </motion.h1>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========== HERO SECTION ========== */}
      <section className="relative h-screen max-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-between py-12 px-6">
        {/* ========== TOP SPACER ========== */}
        <div className="flex-shrink-0 h-20" />

        {/* ========== MAIN TYPOGRAPHY ========== */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: isIntroComplete ? 1 : 0, 
            y: isIntroComplete ? 0 : 100 
          }}
          transition={{ 
            duration: 1.2, 
            delay: isIntroComplete ? 0.3 : 0,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="flex-grow flex items-center justify-center"
        >
          <div className="text-center px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: isIntroComplete ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-gray-500 mb-6"
            >
              MUHAMMAD RADITYA
            </motion.h2>
            
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ 
                opacity: isIntroComplete ? 1 : 0, 
                y: isIntroComplete ? 0 : 40 
              }}
              transition={{ 
                duration: 1.2, 
                delay: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-monument font-black uppercase leading-[0.9] tracking-tight text-white"
            >
              <span className="inline-block">HAIKAL</span>{' '}
              <span className="inline-block">MUMTAZ</span>
            </motion.h1>
          </div>
        </motion.div>

        {/* ========== BOTTOM INFO GRID ========== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: isIntroComplete ? 1 : 0, 
            y: isIntroComplete ? 0 : 50 
          }}
          transition={{ 
            duration: 1, 
            delay: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="w-full max-w-7xl px-6 pb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            
            {/* ========== COLUMN 1 ========== */}
            <AnimatePresence>
              {showScrollIndicator && isIntroComplete && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="hidden lg:flex items-center gap-3"
                >
                  {/* Animated Icon */}
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30"
                    animate={{ 
                      y: [0, 8, 0],
                    }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ChevronDown className="w-5 h-5 text-white/70" />
                  </motion.div>

                  {/* Text */}
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/90">
                      Scroll
                    </span>
                    <span className="text-[10px] font-normal uppercase tracking-widest text-gray-500">
                      To Explore
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========== COLUMN 2 ========== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isIntroComplete ? 1 : 0, 
                y: isIntroComplete ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center justify-center lg:justify-start"
            >
              <div className="font-mono text-sm md:text-base">
                <span className="text-purple-500">&gt;</span>{' '}
                <span className="text-gray-300">{displayedText}</span>
                <motion.span
                  className="inline-block w-[2px] h-5 bg-purple-500 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* ========== COLUMN 3 ========== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isIntroComplete ? 1 : 0, 
                y: isIntroComplete ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex items-center justify-center lg:justify-end"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                <Briefcase className="w-4 h-4" />
                Business Inquiries
              </a>
            </motion.div>

            {/* ========== COLUMN 4 ========== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: isIntroComplete ? 1 : 0, 
                x: isIntroComplete ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex justify-center lg:justify-end"
            >
              <a
                href="/cv.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-purple-500/10"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </motion.div>

          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;