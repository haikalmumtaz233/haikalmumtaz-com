import { useEffect, useRef, useState } from 'react';
import { m, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';
import { useJourney } from '../journey/useJourney';
import type { Bitmap, CosmosLayers, CosmosRequest } from '../lib/cosmos';
import { SKY_SEED } from '../lib/skyStars';

const SKY_MIN_WIDTH = 200;
const SKY_MAX_WIDTH = 480;
const DUST_MAX_WIDTH = 1920;
const LAYER_HEIGHT = 1.4;
const GALAXY_SIZE_DESKTOP = 768;
const GALAXY_SIZE_MOBILE = 512;
const MOBILE_WIDTH = 768;
const REGENERATE_DELAY = 300;
const REGENERATE_WIDTH_CHANGE = 0.15;
const GALAXY_SPIN_SECONDS = 420;

const journeyStops = [0, 0.55, 1];
const galaxyRest = { x: '22vw', y: '-20vh', scale: 0.62, opacity: 0.9 };

const galaxySizeFor = (width: number) =>
  width < MOBILE_WIDTH ? GALAXY_SIZE_MOBILE : GALAXY_SIZE_DESKTOP;

const paint = (canvas: HTMLCanvasElement | null, bitmap: Bitmap) => {
  if (!canvas) return;
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d')?.putImageData(new ImageData(bitmap.data, bitmap.width), 0, 0);
};

const Background = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { progress } = useJourney();
  const skyRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const galaxyRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  const skyY = useTransform(progress, [0, 1], ['0%', '-21%']);
  const dustY = useTransform(progress, [0, 1], ['0%', '-28%']);
  const galaxyX = useTransform(progress, journeyStops, [galaxyRest.x, '-18vw', '-6vw']);
  const galaxyY = useTransform(progress, journeyStops, [galaxyRest.y, '8vh', '30vh']);
  const galaxyScale = useTransform(progress, journeyStops, [galaxyRest.scale, 0.95, 1.5]);
  const galaxyOpacity = useTransform(progress, journeyStops, [galaxyRest.opacity, 0.7, 0.8]);

  useEffect(() => {
    const worker = new Worker(new URL('../lib/cosmos.worker.ts', import.meta.url), {
      type: 'module',
    });
    let generatedWidth = 0;
    let hasGalaxy = false;
    let timer = 0;

    worker.addEventListener('message', (event: MessageEvent<CosmosLayers>) => {
      const { sky, dust, galaxy } = event.data;
      paint(skyRef.current, sky);
      paint(dustRef.current, dust);
      if (galaxy) paint(galaxyRef.current, galaxy);
      setPainted(true);
    });

    const generate = () => {
      const width = window.innerWidth;
      const height = Math.round(window.innerHeight * LAYER_HEIGHT);
      const skyWidth = Math.min(SKY_MAX_WIDTH, Math.max(SKY_MIN_WIDTH, Math.ceil(width / 4)));
      const dustWidth = Math.min(DUST_MAX_WIDTH, width);
      generatedWidth = width;
      const request: CosmosRequest = {
        seed: SKY_SEED,
        sky: { width: skyWidth, height: Math.ceil((height * skyWidth) / width) },
        dust: { width: dustWidth, height: Math.ceil((height * dustWidth) / width) },
        galaxySize: hasGalaxy ? null : galaxySizeFor(width),
      };
      hasGalaxy = true;
      worker.postMessage(request);
    };

    const handleResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const change = Math.abs(window.innerWidth - generatedWidth) / generatedWidth;
        if (change > REGENERATE_WIDTH_CHANGE) generate();
      }, REGENERATE_DELAY);
    };

    generate();
    window.addEventListener('resize', handleResize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    const canvas = starsRef.current;
    if (!canvas) return;

    let stop: (() => void) | null = null;
    let cancelled = false;

    import('../lib/starfield').then(({ runStarfield }) => {
      if (cancelled) return;
      stop = runStarfield(canvas, {
        reduced: prefersReducedMotion,
        progress: () => progress.get(),
      });
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [prefersReducedMotion, progress]);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[-1] overflow-hidden bg-[#09080e]">
      <m.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: painted ? 1 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 2.4, ease: easing.smooth }}
      >
        <m.canvas
          ref={skyRef}
          className="absolute inset-x-0 top-0 block h-[140lvh] w-full"
          style={{ y: prefersReducedMotion ? 0 : skyY }}
        />
        <m.canvas
          ref={dustRef}
          className="absolute inset-x-0 top-0 block h-[140lvh] w-full"
          style={{ y: prefersReducedMotion ? 0 : dustY }}
        />

        <m.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={
            prefersReducedMotion
              ? galaxyRest
              : { x: galaxyX, y: galaxyY, scale: galaxyScale, opacity: galaxyOpacity }
          }
        >
          <div className="[transform:rotate(-26deg)_rotateX(62deg)]">
            <m.canvas
              ref={galaxyRef}
              className="block aspect-square w-[min(72vmax,900px)]"
              {...(prefersReducedMotion
                ? {}
                : {
                    animate: { rotate: -360 },
                    transition: {
                      duration: GALAXY_SPIN_SECONDS,
                      repeat: Infinity,
                      ease: 'linear' as const,
                    },
                  })}
            />
          </div>
        </m.div>
      </m.div>

      <canvas ref={starsRef} className="absolute inset-0 block size-full" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(9, 8, 14, 0.7) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
        }}
      />
    </div>
  );
};

export default Background;
