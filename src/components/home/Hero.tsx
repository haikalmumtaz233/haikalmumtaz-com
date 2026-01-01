import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, Linkedin, Instagram, ChevronDown } from 'lucide-react';

const Hero = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  const roles = ['Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll indicator visibility handler
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (heroBottom >= windowHeight - 10) {
          setShowScrollIndicator(true);
        } else {
          setShowScrollIndicator(false);
        }
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

  const nameParts = [
    { text: 'MUHAMMAD', outline: true },
    { text: 'RADITYA', outline: true },
    { text: 'HAIKAL', outline: false },
    { text: 'MUMTAZ', outline: true },
  ];

  const socialLinks = [
    { Icon: Github, href: 'https://github.com/haikalmumtaz233', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/haikal-mumtaz/', label: 'LinkedIn' },
    { Icon: Instagram, href: 'https://www.instagram.com/haikal_mumtaz23/', label: 'Instagram' },
  ];

  return (
    <>
      {/* ========== INTRO ANIMATION ========== */}
      <AnimatePresence mode="wait">
        {!isIntroComplete && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="flex flex-col items-center justify-center gap-0">
              {nameParts.map((part, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className={`text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-none uppercase ${
                      !part.outline ? 'font-black text-white' : 'font-light text-transparent'
                    }`}
                    style={part.outline ? { WebkitTextStroke: '1px white' } : undefined}
                  >
                    {part.text}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== HERO SECTION: MINIMAL TYPOGRAPHY LAYOUT ========== */}
      <section className="relative h-screen max-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center justify-between py-12 px-6">
        <AnimatePresence>
          {isIntroComplete && (
            <>
              {/* ========== TOP SPACER ========== */}
              <div className="flex-shrink-0 h-20" />

              {/* ========== MAIN TYPOGRAPHY - CENTER STAGE ========== */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="flex-grow flex items-center justify-center"
              >
                <div className="text-center px-4">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-xs md:text-sm font-bold uppercase tracking-[0.5em] text-gray-500 mb-6"
                  >
                    MUHAMMAD RADITYA
                  </motion.h2>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-monument font-black uppercase leading-[0.9] tracking-tight text-white"
                  >
                    <span className="inline-block">HAIKAL</span>{' '}
                    <span className="inline-block">MUMTAZ</span>
                  </motion.h1>
                </div>
              </motion.div>

              {/* ========== BOTTOM INFO GRID (4 COLUMNS) ========== */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="w-full max-w-7xl px-6 pb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
                  
                  {/* ========== COLUMN 1: MODERN SCROLL INDICATOR ========== */}
                  <AnimatePresence>
                    {showScrollIndicator && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3"
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

                  {/* ========== COLUMN 2: ROLE TYPEWRITER ========== */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className="flex items-center justify-start"
                  >
                    <div className="font-mono text-sm md:text-base text-gray-300">
                      <span className="text-purple-500">&gt;</span>{' '}
                      <span>{displayedText}</span>
                      <motion.span
                        className="inline-block w-[2px] h-5 bg-purple-500 ml-1"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  {/* ========== COLUMN 3: SOCIAL LINKS ========== */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex items-center justify-center lg:justify-end gap-3"
                  >
                    {socialLinks.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                        aria-label={label}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </motion.div>

                  {/* ========== COLUMN 4: DOWNLOAD CV CTA ========== */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className="flex justify-center lg:justify-end"
                  >
                    <a
                      href="/cv.pdf"
                      download
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
                    >
                      <Download className="w-4 h-4" />
                      Download CV
                    </a>
                  </motion.div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Hero;