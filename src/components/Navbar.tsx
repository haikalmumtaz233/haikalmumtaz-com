import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'HOME', path: '#top' },
  { name: 'PROJECTS', path: '#projects' },
  { name: 'EXPERIENCE', path: '#experience' },
  { name: 'CONTACT', path: '#contact' },
];

const socialLinks = [
  { Icon: Github, href: 'https://github.com/haikalmumtaz233', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/haikal-mumtaz/', label: 'LinkedIn' },
  { Icon: Instagram, href: 'https://www.instagram.com/haikal_mumtaz23/', label: 'Instagram' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleNavigation = (path: string) => {
    setIsOpen(false);
    if (path === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const DURATION = 0.25;
  const STAGGER = 0.025;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* === TOGGLE BUTTON === */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        onClick={toggleMenu}
        className="fixed top-8 right-8 z-50 w-14 h-14 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all duration-300 cursor-pointer"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Menu className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* === BACKDROP OVERLAY === */}
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

      {/* === SIDE DRAWER === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] z-50 bg-black/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="h-full flex flex-col justify-between p-8 md:p-12">
              
              {/* === NAVIGATION LINKS === */}
              <nav className="flex-1 flex items-center">
                <ul className="space-y-6 w-full">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.1 + index * 0.1, 
                        duration: 0.5,
                        type: "spring",
                        damping: 20
                      }}
                      className="overflow-hidden"
                    >
                      <button 
                        onClick={() => handleNavigation(link.path)} 
                        className="block cursor-pointer text-left w-full group"
                      >
                        <motion.div
                          initial="initial"
                          whileHover="hovered"
                          className="relative block overflow-hidden whitespace-nowrap text-4xl md:text-6xl font-black uppercase text-white"
                          style={{ lineHeight: 0.9 }}
                        >
                          {/* Default State */}
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
                          
                          {/* Hover State */}
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
                        </motion.div>

                        {/* Underline Indicator */}
                        <motion.div
                          className="h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 mt-2"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* === FOOTER SECTION === */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-8 border-t border-white/10 pt-8"
              >
                {/* Email */}
                <a 
                  href="mailto:hmumtaz70@gmail.com" 
                  className="block text-sm md:text-base text-slate-400 hover:text-white transition-colors font-mono"
                >
                  hmumtaz70@gmail.com
                </a>

                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map(({ Icon, href, label }, i) => (
                    <motion.a 
                      key={i}
                      href={href} 
                      target="_blank" 
                      rel="noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </motion.a>
                  ))}
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
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