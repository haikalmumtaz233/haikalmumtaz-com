import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';
import { INTRO_TIMING, markIntroStart } from '../lib/intro';

const NIGHT = '#09080e';

const Intro = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDone, setIsDone] = useState(() => {
    if (prefersReducedMotion) return true;
    markIntroStart();
    return false;
  });

  if (isDone) return null;

  const openDelay = INTRO_TIMING.line - 0.05;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ backgroundColor: NIGHT, willChange: 'transform' }}
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: INTRO_TIMING.open, delay: openDelay, ease: easing.expo }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ backgroundColor: NIGHT, willChange: 'transform' }}
        initial={{ y: '0%' }}
        animate={{ y: '100%' }}
        transition={{ duration: INTRO_TIMING.open, delay: openDelay, ease: easing.expo }}
        onAnimationComplete={() => setIsDone(true)}
      />
      <motion.span
        className="absolute inset-x-0 top-1/2 h-px origin-center bg-white"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{
          duration: INTRO_TIMING.line + 0.45,
          times: [0, 0.55, 1],
          ease: [easing.wipe, easing.exit],
        }}
      />
    </div>
  );
};

export default Intro;
