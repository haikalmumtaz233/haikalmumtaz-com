import { AnimatePresence, m, type PanInfo } from 'motion/react';
import type { Project } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';
import FeaturedCard from './FeaturedCard';

const SWIPE_THRESHOLD = 60;

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const wipeVariants = {
  enter: (dir: number) => ({
    clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
    x: dir > 0 ? 90 : -90,
    opacity: 1,
    scale: 1,
    zIndex: 2,
  }),
  center: {
    clipPath: 'inset(0% 0% 0% 0%)',
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 2,
    transition: {
      clipPath: { duration: 1.05, ease: easing.expo },
      x: { duration: 1.2, ease: easing.expo },
    },
  },
  exit: (dir: number) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    x: dir > 0 ? -140 : 140,
    opacity: 0,
    scale: 0.92,
    zIndex: 1,
    transition: {
      default: { duration: 0.9, ease: easing.inout },
      opacity: { duration: 0.6, ease: easing.exit, delay: 0.15 },
    },
  }),
};

interface FeaturedPreviewProps {
  project: Project;
  index: number;
  direction: number;
  onOpen: (project: Project) => void;
  onSwipe?: (step: number) => void;
  className?: string;
}

const FeaturedPreview = ({
  project,
  index,
  direction,
  onOpen,
  onSwipe,
  className = '',
}: FeaturedPreviewProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canSwipe = Boolean(onSwipe) && !prefersReducedMotion;

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) onSwipe?.(1);
    else if (info.offset.x > SWIPE_THRESHOLD) onSwipe?.(-1);
  };

  return (
    <div
      id="featured-preview"
      role="tabpanel"
      aria-labelledby={`featured-tab-${index}`}
      className={`relative ${className}`}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <m.div
          key={index}
          custom={direction}
          variants={prefersReducedMotion ? fadeVariants : wipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={prefersReducedMotion ? { duration: 0.2 } : undefined}
          className="absolute inset-0"
          drag={canSwipe ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          style={{ touchAction: 'pan-y' }}
        >
          <FeaturedCard project={project} onClick={() => onOpen(project)} />
        </m.div>
      </AnimatePresence>
    </div>
  );
};

export default FeaturedPreview;
