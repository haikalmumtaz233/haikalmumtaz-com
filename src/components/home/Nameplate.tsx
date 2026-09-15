import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useFittedTextSize } from '../../hooks/useFittedTextSize';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const NAMEPLATE_TEXT = 'HAIKAL MUMTAZ';
const LETTERS = NAMEPLATE_TEXT.split('');
const CENTER = (LETTERS.length - 1) / 2;

const NAMEPLATE_TIMING = {
  ruleDelay: 0.1,
  ruleDuration: 2.1,
  riseDelay: 0.45,
  riseStagger: 0.055,
  riseDuration: 1.15,
};

const centrality = (index: number) => 1 - Math.abs(index - CENTER) / CENTER;

const liftFor = (index: number) => 70 + centrality(index) * 190;

interface NameplateProps {
  scrollProgress: MotionValue<number>;
}

interface LetterProps {
  char: string;
  index: number;
  scrollProgress: MotionValue<number>;
}

const Letter = ({ char, index, scrollProgress }: LetterProps) => {
  const lift = useTransform(scrollProgress, [0, 1], [0, -liftFor(index)]);
  const fade = useTransform(scrollProgress, [0.05, 0.75 - centrality(index) * 0.35], [1, 0]);
  const delay =
    NAMEPLATE_TIMING.riseDelay + Math.abs(index - CENTER) * NAMEPLATE_TIMING.riseStagger;

  return (
    <motion.span className="inline-block" style={{ y: lift, opacity: fade }}>
      <span className="inline-block overflow-hidden align-top py-[0.08em] -my-[0.08em]">
        <motion.span
          className="inline-block"
          initial={{ y: '118%' }}
          animate={{ y: '0%' }}
          transition={{ duration: NAMEPLATE_TIMING.riseDuration, ease: easing.expo, delay }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      </span>
    </motion.span>
  );
};

const Nameplate = ({ scrollProgress }: NameplateProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { containerRef, measureRef, fittedSize, referenceFontSize } =
    useFittedTextSize(NAMEPLATE_TEXT);

  const hasMeasured = fittedSize > 0;
  const typeClass = 'font-monument font-black uppercase tracking-tight whitespace-nowrap';

  return (
    <div ref={containerRef} className="relative w-full overflow-x-clip">
      <span
        ref={measureRef}
        aria-hidden="true"
        className={typeClass}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          fontSize: `${referenceFontSize}px`,
          left: -99999,
          top: 0,
        }}
      >
        {LETTERS.map((char, index) => (
          <span key={index} className="inline-block">
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>

      {prefersReducedMotion ? (
        <h1
          className={`${typeClass} text-white text-center leading-[0.9]`}
          style={{
            fontSize: hasMeasured ? `${fittedSize}px` : undefined,
            visibility: hasMeasured ? 'visible' : 'hidden',
          }}
        >
          {NAMEPLATE_TEXT}
        </h1>
      ) : (
        <div className="relative">
          <h1
            aria-label={NAMEPLATE_TEXT}
            className={`${typeClass} text-white text-center leading-[0.9]`}
            style={{
              fontSize: hasMeasured ? `${fittedSize}px` : undefined,
              visibility: hasMeasured ? 'visible' : 'hidden',
            }}
          >
            {hasMeasured &&
              LETTERS.map((char, index) => (
                <Letter
                  key={index}
                  char={char}
                  index={index}
                  scrollProgress={scrollProgress}
                />
              ))}
          </h1>

          {hasMeasured && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-[0.06em] h-px bg-white/80"
              style={{ fontSize: `${fittedSize}px` }}
              initial={{ clipPath: 'inset(0 50% 0 50%)' }}
              animate={{
                clipPath: [
                  'inset(0 50% 0 50%)',
                  'inset(0 0% 0 0%)',
                  'inset(0 0% 0 0%)',
                  'inset(0 50% 0 50%)',
                ],
              }}
              transition={{
                duration: NAMEPLATE_TIMING.ruleDuration,
                delay: NAMEPLATE_TIMING.ruleDelay,
                times: [0, 0.3, 0.68, 1],
                ease: [easing.wipe, 'linear', easing.wipe],
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Nameplate;
