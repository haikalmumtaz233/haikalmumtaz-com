import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useFittedTextSize } from '../../hooks/useFittedTextSize';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { CONDENSED_SCALE, DEPARTURE_LIFT, easing, seconds } from '../../lib/motion';

const NAMEPLATE_TEXT = 'HAIKAL MUMTAZ';
const DEPARTURE_BLUR = 6;

interface NameplateProps {
  scrollProgress: MotionValue<number>;
}

const Nameplate = ({ scrollProgress }: NameplateProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const allowBlur = useMediaQuery('(min-width: 768px)');
  const { containerRef, measureRef, fittedSize, referenceFontSize } =
    useFittedTextSize(NAMEPLATE_TEXT);

  const collapseScaleX = useTransform(scrollProgress, [0, 1], [1, CONDENSED_SCALE]);
  const collapseOpacity = useTransform(scrollProgress, [0, 0.85], [1, 0]);
  const collapseY = useTransform(scrollProgress, [0, 1], [0, DEPARTURE_LIFT]);
  const collapseBlur = useTransform(
    scrollProgress,
    [0, 1],
    ['blur(0px)', `blur(${DEPARTURE_BLUR}px)`]
  );

  const hasMeasured = fittedSize > 0;

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <span
        ref={measureRef}
        aria-hidden="true"
        className="font-monument font-black uppercase tracking-tight whitespace-nowrap"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          fontSize: `${referenceFontSize}px`,
          left: -99999,
          top: 0,
        }}
      >
        {NAMEPLATE_TEXT}
      </span>

      <motion.div
        style={{
          scaleX: prefersReducedMotion ? 1 : collapseScaleX,
          opacity: prefersReducedMotion ? 1 : collapseOpacity,
          y: prefersReducedMotion ? 0 : collapseY,
          filter: prefersReducedMotion || !allowBlur ? 'none' : collapseBlur,
          transformOrigin: 'center',
          willChange: 'transform, opacity, filter',
        }}
      >
        <motion.h1
          initial={prefersReducedMotion ? false : { scaleX: CONDENSED_SCALE, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1.1,
            ease: easing.smooth,
            opacity: { duration: seconds('slow'), ease: easing.smooth },
          }}
          className="font-monument font-black uppercase tracking-tight whitespace-nowrap text-white text-center leading-[0.9]"
          style={{
            fontSize: hasMeasured ? `${fittedSize}px` : undefined,
            visibility: hasMeasured ? 'visible' : 'hidden',
            transformOrigin: 'center',
          }}
        >
          {NAMEPLATE_TEXT}
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default Nameplate;
