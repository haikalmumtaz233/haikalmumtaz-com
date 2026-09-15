import { useEffect, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useFittedTextSize } from '../../hooks/useFittedTextSize';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { easing } from '../../lib/motion';
import { useIntroGate } from '../../lib/intro';

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

const WORDS = NAMEPLATE_TEXT.split(' ');
const WORD_STARTS = WORDS.map((_, wordIndex) =>
  WORDS.slice(0, wordIndex).reduce((total, word) => total + word.length + 1, 0)
);

interface NameplateProps {
  scrollProgress: MotionValue<number>;
}

interface IntroGate {
  gated: boolean;
  ready: boolean;
}

interface LetterProps {
  char: string;
  kern: number;
  delay: number;
  lift: number;
  fadeEnd: number;
  order: number;
  gate: IntroGate;
  scrollProgress: MotionValue<number>;
}

const Letter = ({ char, kern, delay, lift: liftDistance, fadeEnd, order, gate, scrollProgress }: LetterProps) => {
  const lift = useTransform(scrollProgress, [0, 1], [0, liftDistance]);
  const fade = useTransform(scrollProgress, [0.05, fadeEnd], [1, 0]);

  const reveal = gate.gated
    ? {
        initial: { opacity: 0, y: '0%' },
        animate: { opacity: gate.ready ? 1 : 0, y: '0%' },
        transition: { duration: 0.5, ease: easing.smooth, delay: gate.ready ? order * 0.025 : 0 },
      }
    : {
        initial: { y: '118%' },
        animate: { y: '0%' },
        transition: { duration: NAMEPLATE_TIMING.riseDuration, ease: easing.expo, delay },
      };

  return (
    <motion.span className="inline-block" style={{ y: lift, opacity: fade, marginRight: `${kern}em` }}>
      <span className="inline-block overflow-hidden align-top py-[0.08em] -my-[0.08em] px-[0.12em] -mx-[0.12em]">
        <motion.span className="inline-block" {...reveal}>
          {char.trim() && (
            <span data-glyph-origin={char} aria-hidden="true" className="inline-block h-0 w-0 align-baseline" />
          )}
          {glyph(char)}
        </motion.span>
      </span>
    </motion.span>
  );
};

interface StackedWordProps {
  word: string;
  wordIndex: number;
  kerning: number[];
  gate: IntroGate;
  scrollProgress: MotionValue<number>;
}

const StackedWord = ({ word, wordIndex, kerning, gate, scrollProgress }: StackedWordProps) => {
  const { containerRef, measureRef, fittedSize, referenceFontSize } = useFittedTextSize(word);
  const letters = word.split('');
  const middle = (letters.length - 1) / 2;
  const direction = wordIndex === 0 ? -1 : 1;
  const start = WORD_STARTS[wordIndex];

  return (
    <div ref={containerRef} className="relative w-full">
      <span
        ref={measureRef}
        aria-hidden="true"
        className={TYPE_CLASS}
        style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', fontSize: `${referenceFontSize}px`, left: -99999, top: 0 }}
      >
        {word}
      </span>
      <span
        aria-hidden="true"
        className={`${TYPE_CLASS} block text-white text-center leading-[0.86]`}
        style={{ fontSize: fittedSize > 0 ? `${fittedSize}px` : undefined, visibility: fittedSize > 0 ? 'visible' : 'hidden' }}
      >
        {fittedSize > 0 &&
          letters.map((char, letterIndex) => {
            const spread = middle === 0 ? 0 : Math.abs(letterIndex - middle) / middle;
            const isLast = letterIndex === letters.length - 1;
            return (
              <Letter
                key={letterIndex}
                char={char}
                kern={isLast ? 0 : kerning[start + letterIndex] ?? 0}
                delay={NAMEPLATE_TIMING.riseDelay + wordIndex * 0.14 + spread * middle * NAMEPLATE_TIMING.riseStagger}
                lift={direction * (50 + (1 - spread) * 150)}
                fadeEnd={0.7 - (1 - spread) * 0.3}
                order={start + letterIndex}
                gate={gate}
                scrollProgress={scrollProgress}
              />
            );
          })}
      </span>
    </div>
  );
};

const StackedNameplate = ({ scrollProgress, gate }: NameplateProps & { gate: IntroGate }) => {
  const kerning = useKerning(true);
  const ruleScale = useTransform(scrollProgress, [0, 0.35], [1, 2.6]);
  const ruleFade = useTransform(scrollProgress, [0, 0.35], [1, 0]);

  return (
    <h1 aria-label={NAMEPLATE_TEXT} className="relative w-full">
      <StackedWord word={WORDS[0]} wordIndex={0} kerning={kerning} gate={gate} scrollProgress={scrollProgress} />
      <motion.span
        aria-hidden="true"
        className="relative my-[3vw] block h-px w-full"
        style={{ scaleX: ruleScale, opacity: ruleFade }}
      >
        <motion.span
          className="absolute inset-0 origin-center bg-white/80"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: gate.ready ? 1 : 0 }}
          transition={{ duration: 1.1, delay: gate.gated ? 0.3 : NAMEPLATE_TIMING.ruleDelay, ease: easing.wipe }}
        />
      </motion.span>
      <StackedWord word={WORDS[1]} wordIndex={1} kerning={kerning} gate={gate} scrollProgress={scrollProgress} />
    </h1>
  );
};

const Nameplate = (props: NameplateProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const gate = useIntroGate();

  if (isMobile && !prefersReducedMotion) {
    return <StackedNameplate {...props} gate={gate} />;
  }

  return <LinearNameplate {...props} gate={gate} />;
};

const LinearNameplate = ({ scrollProgress, gate }: NameplateProps & { gate: IntroGate }) => {
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
                  kern={kerning[index] ?? 0}
                  delay={NAMEPLATE_TIMING.riseDelay + Math.abs(index - CENTER) * NAMEPLATE_TIMING.riseStagger}
                  lift={-liftFor(index)}
                  fadeEnd={0.75 - centrality(index) * 0.35}
                  order={index}
                  gate={gate}
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
              animate={
                gate.ready
                  ? {
                      clipPath: [
                        'inset(0 50% 0 50%)',
                        'inset(0 0% 0 0%)',
                        'inset(0 0% 0 0%)',
                        'inset(0 50% 0 50%)',
                      ],
                    }
                  : { clipPath: 'inset(0 50% 0 50%)' }
              }
              transition={{
                duration: NAMEPLATE_TIMING.ruleDuration,
                delay: gate.gated ? 0.3 : NAMEPLATE_TIMING.ruleDelay,
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
