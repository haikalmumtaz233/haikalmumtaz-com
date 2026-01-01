import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, Linkedin, Instagram } from 'lucide-react';

const Hero = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const roles = ['Fullstack Developer', 'Machine Learning Eng', 'Data Scientist'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isIntroComplete) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isIntroComplete]);

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
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] as const }}
          >
            <div className="flex flex-col items-center justify-center gap-0">
              {nameParts.map((part, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.43, 0.13, 0.23, 0.96] as const }}
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

      {/* ========== HERO SECTION: CINEMATIC HEADER ========== */}
      <section className="relative min-h-screen bg-transparent text-white overflow-hidden flex flex-col items-center pt-24 lg:pt-32 pb-16">
        <AnimatePresence>
          {isIntroComplete && (
            <>
              {/* ========== 1. CINEMATIC HEADER: THE NAME ========== */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-8 lg:mb-12 relative z-20 px-6"
              >
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xs md:text-sm lg:text-base font-bold uppercase tracking-[0.5em] text-gray-500 mb-2 lg:mb-3"
                >
                  MUHAMMAD RADITYA
                </motion.h2>
                
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-[0.9] tracking-tighter"
                >
                  <span className="text-transparent" style={{ WebkitTextStroke: '1px #a855f7' }}>HAIKAL</span>
                  {' '}
                  <span className="text-white">MUMTAZ</span>
                </motion.h1>
              </motion.div>

              {/* ========== 2. COMPACT 3-COLUMN GRID ========== */}
              <div className="w-full max-w-[1400px] px-6 lg:px-12 flex-grow flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">
                  
                  {/* ========== LEFT COL: BIO & ACTIONS (RIGHT-ALIGNED) ========== */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="col-span-12 lg:col-span-3 flex flex-col items-center lg:items-end text-center lg:text-right relative z-20 order-2 lg:order-1"
                  >
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                      className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-4"
                    >
                      Who am I?
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="text-gray-400 text-sm lg:text-base max-w-xs leading-relaxed mb-8"
                    >
                      Creative and solution-oriented individual with expertise in full-stack development, machine learning, and IoT systems. Passionate about building innovative products.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="flex flex-col gap-4 w-full max-w-xs"
                    >
                      <a
                        href="/cv.pdf"
                        download
                        className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
                      >
                        <Download className="w-4 h-4" />
                        Download CV
                      </a>

                      <div className="flex gap-3 justify-center lg:justify-end">
                        {socialLinks.map(({ Icon, href, label }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-purple-500 hover:border-purple-500 transition-all duration-300"
                            aria-label={label}
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* ========== CENTER COL: IMAGE (CLEAN & SHARP) ========== */}
                  <div className="col-span-12 lg:col-span-6 relative flex justify-center items-center order-1 lg:order-2">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 1, delay: 0.7, ease: [0.43, 0.13, 0.23, 0.96] as const }}
                      className="relative h-[50vh] lg:h-[65vh] flex items-end justify-center"
                    >
                      <img
                        src="src/assets/itc-nobg.png"
                        alt="Muhammad Raditya Haikal Mumtaz"
                        className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                      />

                      {/* Purple Glow Effect (Subtle Atmosphere) */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[120%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none opacity-30 -z-10" />
                    </motion.div>
                  </div>

                  {/* ========== RIGHT COL: CURRENT ROLE (LEFT-ALIGNED) ========== */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="col-span-12 lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left relative z-20 order-3"
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500 mb-6"
                    >
                      Current Focus
                    </motion.span>

                    <div className="overflow-hidden h-28 lg:h-32 flex items-center max-w-xs">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentRoleIndex}
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -50, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] as const }}
                          className="text-3xl lg:text-4xl xl:text-5xl font-black uppercase leading-tight tracking-tighter text-white"
                        >
                          {roles[currentRoleIndex]}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                      className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mt-6 origin-left rounded-full"
                    />
                  </motion.div>

                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Hero;