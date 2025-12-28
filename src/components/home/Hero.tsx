import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Github, Linkedin, Instagram, Rocket } from 'lucide-react';

const Hero = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = ['Fullstack Developer', 'Machine Learning Engineer', 'Data Scientist'];

  /* === ENTRANCE SEQUENCE TRIGGER === */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  /* === TYPEWRITER EFFECT === */
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

  /* === ANIMATION VARIANTS === */
  const nameBlocks = [
    { text: 'MUHAMMAD', delay: 0, from: 'left', layoutId: 'name-1' },
    { text: 'RADITYA', delay: 0.15, from: 'right', layoutId: 'name-2' },
    { text: 'HAIKAL', delay: 0.3, from: 'left', layoutId: 'name-3' },
    { text: 'MUMTAZ', delay: 0.45, from: 'right', layoutId: 'name-4' },
  ];

  const secondaryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: 0.5,
      },
    },
  };

  const socialLinks = [
    { Icon: Github, href: 'https://github.com', label: 'GitHub' },
    { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <>
      {/* === ENTRANCE SEQUENCE OVERLAY === */}
      <AnimatePresence>
        {!isIntroComplete && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* === NOISE TEXTURE === */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
              }}
            />
            
            {/* === FLYING NAME BLOCKS === */}
            <div className="flex flex-col items-center justify-center gap-1">
              {nameBlocks.map((block) => (
                <motion.div
                  key={block.text}
                  layoutId={block.layoutId}
                  initial={{
                    x: block.from === 'left' ? '-100vw' : '100vw',
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: block.delay,
                    ease: [0.43, 0.13, 0.23, 0.96],
                  }}
                  className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white uppercase"
                >
                  {block.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === HERO SECTION === */}
      <section className="relative h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
        {/* === GRID BACKGROUND === */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black 0%, transparent 100%)',
          }}
        />

        {/* === MOVING GRADIENT MESH === */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20"
            style={{
              backgroundSize: '400% 400%',
            }}
          />
        </div>

        {/* === NOISE TEXTURE === */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
          <div className="flex items-center justify-center h-full">
            {/* === 2-COLUMN GRID LAYOUT === */}
            <AnimatePresence>
              {isIntroComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-h-full"
                >
                  {/* === LEFT COLUMN: CONTENT === */}
                  <div className="flex flex-col justify-center">
                    {/* === NAME STACK === */}
                    <div className="mb-4">
                      {nameBlocks.map((block) => (
                        <motion.h1
                          key={block.text}
                          layoutId={block.layoutId}
                          className={`font-black uppercase tracking-tighter leading-[0.9] text-4xl md:text-6xl lg:text-7xl ${
                            block.text === 'HAIKAL' 
                              ? 'text-white' 
                              : 'text-transparent'
                          }`}
                          style={
                            block.text !== 'HAIKAL'
                              ? {
                                  WebkitTextStroke: '2px white',
                                }
                              : undefined
                          }
                        >
                          {block.text}
                        </motion.h1>
                      ))}
                    </div>

                    {/* === STATUS INDICATOR === */}
                    <motion.div
                      variants={secondaryVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-gray-300 text-sm">Ready to help your project 🚀</span>
                    </motion.div>

                    {/* === BIO === */}
                    <motion.p
                      variants={secondaryVariants}
                      initial="hidden"
                      animate="visible"
                      className="text-gray-400 max-w-lg leading-relaxed text-sm md:text-base mb-6 line-clamp-4"
                    >
                      Creative and solution-oriented individual with expertise in full-stack development, machine learning, and IoT systems. Passionate about building innovative products that solve real-world problems.
                    </motion.p>

                    {/* === SOCIAL ICONS === */}
                    <motion.div
                      variants={secondaryVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-4 mb-6"
                    >
                      {socialLinks.map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                          aria-label={label}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </a>
                      ))}
                    </motion.div>

                    {/* === CTA BUTTON === */}
                    <motion.a
                      variants={secondaryVariants}
                      initial="hidden"
                      animate="visible"
                      href="/cv.pdf"
                      download
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-100 transition-colors w-fit cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      Download CV
                    </motion.a>
                  </div>

                  {/* === RIGHT COLUMN: PORTRAIT + FLOATING GLASS CARD === */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="relative w-full max-w-md mx-auto lg:max-w-full h-[70vh] group"
                  >
                    {/* === PORTRAIT CONTAINER === */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      {/* === PORTRAIT IMAGE === */}
                      <img
                        src="src/assets/itc-nobg.png"
                        alt="Portrait"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out cursor-pointer"
                      />

                      {/* === FLOATING GLASS CARD OVERLAY === */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-black/60 border border-white/10 rounded-xl p-4"
                      >
                        {/* === I AM A === */}
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                          I AM A
                        </p>

                        {/* === TYPEWRITER ROLE === */}
                        <div className="mb-3">
                          <h2 className="text-xl md:text-2xl font-bold text-white">
                            {displayText}
                            <span className="animate-pulse">|</span>
                          </h2>
                        </div>

                        {/* === LOCATION === */}
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                          YOGYAKARTA, INDONESIA
                        </p>
                      </motion.div>
                    </div>

                    {/* === DECORATIVE GRADIENT === */}
                    <div className="absolute -z-10 -right-10 top-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-full blur-3xl pointer-events-none" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* === SCROLL INDICATOR === */}
        <AnimatePresence>
          {isIntroComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full"></motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Hero;

