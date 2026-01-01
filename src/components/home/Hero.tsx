import { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Download, Github, Linkedin, Instagram, ArrowDown, MapPin } from 'lucide-react';

const Hero = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = ['Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isIntroComplete) return;
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, isIntroComplete]);

  const nameParts = [
    { text: 'MUHAMMAD', outline: true },
    { text: 'RADITYA', outline: true },
    { text: 'HAIKAL', outline: false },
    { text: 'MUMTAZ', outline: true },
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.43, 0.13, 0.23, 0.96] as const
      } 
    },
  };

  const socialLinks = [
    { Icon: Github, href: 'https://github.com/haikalmumtaz233', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/haikal-mumtaz/', label: 'LinkedIn' },
    { Icon: Instagram, href: 'https://www.instagram.com/haikal_mumtaz23/', label: 'Instagram' },
  ];

  return (
    <>
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

      <section className="relative min-h-screen lg:h-screen flex items-center justify-center overflow-hidden py-20 lg:py-0">
        <div className="w-full max-w-7xl px-6 md:px-12 lg:px-16 relative z-10">
          <AnimatePresence>
            {isIntroComplete && (
              <motion.div
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
              >
                <div className="lg:col-span-7 flex flex-col justify-center items-start">
                  
                  <div className="flex flex-col mb-8">
                    {nameParts.map((part, i) => (
                      <motion.h1
                        key={i}
                        variants={fadeInUp}
                        custom={i}
                        className={`text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[0.85] uppercase ${
                          !part.outline ? 'font-black text-white' : 'font-light text-transparent'
                        }`}
                        style={part.outline ? { WebkitTextStroke: '1px rgba(255,255,255,0.8)' } : undefined}
                      >
                        {part.text}
                      </motion.h1>
                    ))}
                  </div>

                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center gap-3 mb-8 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit backdrop-blur-sm"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-gray-200 text-xs md:text-sm font-medium tracking-wide">
                      Ready to help your project 🚀
                    </span>
                  </motion.div>

                  <motion.p 
                    variants={fadeInUp}
                    className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed mb-10"
                  >
                    Creative and solution-oriented individual with expertise in full-stack development, machine learning, and IoT systems. Passionate about building innovative products that solve real-world problems.
                  </motion.p>

                  <motion.div 
                    variants={fadeInUp}
                    className="flex flex-wrap items-center gap-6"
                  >
                    <div className="flex gap-4">
                      {socialLinks.map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                          aria-label={label}
                        >
                          <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        </a>
                      ))}
                    </div>

                    <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />

                    <a
                      href="/cv.pdf"
                      download
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-wide rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      Download CV
                    </a>
                  </motion.div>
                </div>

                <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] as const }}
                    className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-[#111111] shadow-2xl group"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <img
                      src="src/assets/itc-nobg.png"
                      alt="Portrait"
                      className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex flex-col gap-1 mb-3">
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                            I am a
                          </span>
                          <h2 className="text-xl md:text-2xl font-bold text-white min-h-[32px]">
                            {displayText}
                            <span className="animate-pulse ml-1 text-purple-400">|</span>
                          </h2>
                        </div>
                        
                        <div className="w-full h-[1px] bg-white/10 my-3" />
                        
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[10px] font-mono uppercase tracking-widest">
                            Yogyakarta, Indonesia
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none opacity-30" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isIntroComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-8 rounded-full border border-white/20 flex justify-center p-1"
              >
                <div className="w-1 h-2 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Hero;