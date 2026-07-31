import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { animatedProps } from '../lib/motion';
import MenuPanel, { MENU_PANEL_ID } from './MenuPanel';

const MenuToggle = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const iconMotion = animatedProps(prefersReducedMotion, {
    initial: { opacity: 0, rotate: -45 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 45 },
    transition: { duration: 0.2 },
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls={MENU_PANEL_ID}
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:h-14 sm:w-14"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={isOpen ? 'close' : 'open'} {...iconMotion} className="flex">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <MenuPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MenuToggle;
