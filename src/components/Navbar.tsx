import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* === NAV LINKS === */
const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'PORTFOLIO', path: '/portfolio' },
  { name: 'ACHIEVEMENTS', path: '/achievements' },
  { name: 'HOBBIES', path: '/hobbies' },
];

const socialLinks = [
  { Icon: Github, href: 'https://github.com', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Animation constants
  const DURATION = 0.25;
  const STAGGER = 0.025;

  /* === DISABLE BODY SCROLL WHEN MENU OPEN === */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* === HAMBURGER TOGGLE BUTTON === */}
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
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* === FULLSCREEN OVERLAY MENU === */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-40 bg-[#09090b] overflow-hidden"
          >
            {/* === MENU CONTENT === */}
            <div className="h-full flex flex-col items-center justify-center px-6">
              {/* === NAVIGATION LINKS === */}
              <nav className="mb-16">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.3 + index * 0.1, 
                        duration: 0.6, 
                        ease: [0.43, 0.13, 0.23, 0.96] 
                      }}
                      className="overflow-hidden"
                    >
                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className="block cursor-pointer"
                      >
                        <motion.div
                          initial="initial"
                          whileHover="hovered"
                          className="relative block overflow-hidden whitespace-nowrap text-6xl md:text-8xl font-black uppercase text-white"
                          style={{ lineHeight: 0.9 }}
                        >
                          {/* PRIMARY TEXT (Moves Up) */}
                          <div>
                            {link.name.split("").map((l, i) => (
                              <motion.span
                                variants={{
                                  initial: { y: 0 },
                                  hovered: { y: "-100%" },
                                }}
                                transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
                                className="inline-block"
                                key={i}
                              >
                                {l}
                              </motion.span>
                            ))}
                          </div>

                          {/* SECONDARY TEXT (Comes from bottom) */}
                          <div className="absolute inset-0">
                            {link.name.split("").map((l, i) => (
                              <motion.span
                                variants={{
                                  initial: { y: "100%" },
                                  hovered: { y: 0 },
                                }}
                                transition={{ duration: DURATION, ease: "easeInOut", delay: STAGGER * i }}
                                className="inline-block text-cyan-400"
                                key={i}
                              >
                                {l}
                              </motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* === FOOTER INFO === */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-0 left-0 w-full px-8 pb-8 flex justify-between items-end"
              >
                {/* === EMAIL === */}
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Email</p>
                  <a 
                    href="mailto:hmumtaz70@gmail.com" 
                    className="text-base text-white hover:text-cyan-400 transition-colors duration-300"
                  >
                    hmumtaz70@gmail.com
                  </a>
                </div>

                {/* === SOCIAL ICONS === */}
                <div className="flex items-center gap-4">
                  {socialLinks.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all duration-300 cursor-pointer"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* === DECORATIVE GRADIENT === */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

