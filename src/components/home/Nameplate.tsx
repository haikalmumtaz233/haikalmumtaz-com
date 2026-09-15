import { useEffect, useState } from 'react';
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

const TYPE_CLASS = 'font-monument font-black uppercase tracking-tight whitespace-nowrap';

const glyph = (char: string) => (char === ' ' ? '\u00A0' : char);

const useKerning = (enabled: boolean) => {
  const [kerning, setKerning] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;

      const probe = document.createElement('span');
      probe.className = TYPE_CLASS;
      probe.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;font-size:100px';
      document.body.appendChild(probe);

      const widthOf = (text: string) => {
        probe.textContent = text;
        return probe.getBoundingClientRect().width;
      };

      const offsets = LETTERS.map((char, index) => {
        const next = LETTERS[index + 1];
        if (!next) return 0;
        const pair = widthOf(glyph(char) + glyph(next));
        return (pair - widthOf(glyph(char)) - widthOf(glyph(next))) / 100;
      });

      probe.remove();
      setKerning(offsets);
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return kerning;
};

const liftFor = (index: number) => 70 + centrality(index) * 190;

interface NameplateProps {
  scrollProgress: MotionValue<number>;
  offset?: number;
}

interface LetterProps {
  char: string;
  index: number;
  kern: number;
  offset: number;
  scrollProgress: MotionValue<number>;
}

const Letter = ({ char, index, kern, offset, scrollProgress }: LetterProps) => {
  const lift = useTransform(scrollProgress, [0, 1], [0, -liftFor(index)]);
  const fade = useTransform(scrollProgress, [0.05, 0.75 - centrality(index) * 0.35], [1, 0]);
  const delay =
    offset + NAMEPLATE_TIMING.riseDelay + Math.abs(index - CENTER) * NAMEPLATE_TIMING.riseStagger;

  return (
    <motion.span className="inline-block" style={{ y: lift, opacity: fade, marginRight: `${kern}em` }}>
      <span className="inline-block overflow-hidden align-top py-[0.08em] -my-[0.08em] px-[0.12em] -mx-[0.12em]">
        <motion.span
          className="inline-block"
          initial={{ y: '118%' }}
          animate={{ y: '0%' }}
          transition={{ duration: NAMEPLATE_TIMING.riseDuration, ease: easing.expo, delay }}
        >
          {glyph(char)}
        </motion.span>
      </span>
    </motion.span>
  );
};

const Nameplate = ({ scrollProgress, offset = 0 }: NameplateProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { containerRef, measureRef, fittedSize, referenceFontSize } =
    useFittedTextSize(NAMEPLATE_TEXT);

  const kerning = useKerning(!prefersReducedMotion);

  const hasMeasured = fittedSize > 0;

  return (
    <div ref={containerRef} className="relative w-full overflow-x-clip">
      <span
        ref={measureRef}
        aria-hidden="true"
        className={TYPE_CLASS}
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

      {prefersReducedMotion ? (
        <h1
          className={`${TYPE_CLASS} text-white text-center leading-[0.9]`}
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
            className={`${TYPE_CLASS} text-white text-center leading-[0.9]`}
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
                  kern={kerning[index] ?? 0}
                  offset={offset}
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
                delay: offset + NAMEPLATE_TIMING.ruleDelay,
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
