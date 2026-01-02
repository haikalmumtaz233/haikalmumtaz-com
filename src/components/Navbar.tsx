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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-40 bg-[#09090b] overflow-hidden"
          >
            <div className="h-full flex flex-col items-center justify-center px-6">
              <nav className="mb-16">
                <ul className="space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      className="overflow-hidden"
                    >
                      <button onClick={() => handleNavigation(link.path)} className="block cursor-pointer text-center w-full">
                        <motion.div
                          initial="initial"
                          whileHover="hovered"
                          className="relative block overflow-hidden whitespace-nowrap text-6xl md:text-8xl font-black uppercase text-white"
                          style={{ lineHeight: 0.9 }}
                        >
                          <div>
                            {link.name.split("").map((l, i) => (
                              <motion.span variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }} transition={{ duration: DURATION, delay: STAGGER * i }} className="inline-block" key={i}>{l}</motion.span>
                            ))}
                          </div>
                          <div className="absolute inset-0">
                            {link.name.split("").map((l, i) => (
                              <motion.span variants={{ initial: { y: "100%" }, hovered: { y: 0 } }} transition={{ duration: DURATION, delay: STAGGER * i }} className="inline-block text-slate-500" key={i}>{l}</motion.span>
                            ))}
                          </div>
                        </motion.div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="absolute bottom-0 left-0 w-full px-8 pb-8 flex justify-between items-end">
                <a href="mailto:hmumtaz70@gmail.com" className="text-white hover:text-white/70 transition-colors">hmumtaz70@gmail.com</a>
                <div className="flex gap-4">
                  {socialLinks.map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"><Icon className="w-4 h-4 text-white" /></a>
                  ))}
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