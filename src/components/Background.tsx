import { useEffect, useRef, useState } from 'react';
import { m, useTransform } from 'motion/react';
import { useLocation } from 'react-router';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { easing } from '../lib/motion';
import { useJourney } from '../journey/useJourney';
import { planetLayout, type CosmosImages, type CosmosRequest } from '../lib/cosmos';
import { SKY_SEED } from '../lib/skyStars';

const SKY_MIN_WIDTH = 200;
const SKY_MAX_WIDTH = 480;
const DUST_MAX_WIDTH = 1920;
const PLANET_MAX_WIDTH = 2400;
const PLANET_MAX_SCALE = 1.5;
const LAYER_HEIGHT = 1.4;
const REGENERATE_DELAY = 300;
const REGENERATE_WIDTH_CHANGE = 0.15;

const planetStops = [0, 0.6, 1];
const planetRise = ['-4vh', '-12vh', '-44vh'];
const planetRest = '-16vh';
const PLANET_PATH = '/';

const show = (canvas: HTMLCanvasElement | null, image: ImageBitmap) => {
  const ctx = canvas?.getContext('bitmaprenderer');
  if (!canvas || !ctx) {
    image.close();
    return;
  }
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.transferFromImageBitmap(image);
};

const Background = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { progress, scrollY } = useJourney();
  const { pathname } = useLocation();
  const showPlanet = pathname === PLANET_PATH;
  const skyRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const planetRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<HTMLCanvasElement>(null);
  const [painted, setPainted] = useState(false);

  const skyY = useTransform(progress, [0, 1], ['0%', '-21%']);
  const dustY = useTransform(progress, [0, 1], ['0%', '-28%']);
  const planetY = useTransform(progress, planetStops, planetRise);

  useEffect(() => {
    const worker = new Worker(new URL('../lib/cosmos.worker.ts', import.meta.url), {
      type: 'module',
    });
    let generatedWidth = 0;
    let timer = 0;

    worker.addEventListener('message', (event: MessageEvent<CosmosImages>) => {
      const { sky, dust, planet } = event.data;
      show(skyRef.current, sky);
      show(dustRef.current, dust);
      show(planetRef.current, planet);
      setPainted(true);
    });

    const generate = () => {
      const width = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const height = Math.round(viewportHeight * LAYER_HEIGHT);
      const skyWidth = Math.min(SKY_MAX_WIDTH, Math.max(SKY_MIN_WIDTH, Math.ceil(width / 4)));
      const dustWidth = Math.min(DUST_MAX_WIDTH, width);
      const planet = planetLayout(width, viewportHeight);
      const planetScale = Math.min(
        window.devicePixelRatio || 1,
        PLANET_MAX_SCALE,
        PLANET_MAX_WIDTH / width,
      );
      if (planetRef.current) planetRef.current.style.height = `${planet.height}px`;
      generatedWidth = width;

      const request: CosmosRequest = {
        seed: SKY_SEED,
        sky: { width: skyWidth, height: Math.ceil((height * skyWidth) / width) },
        dust: { width: dustWidth, height: Math.ceil((height * dustWidth) / width) },
        planet: {
          width: Math.round(width * planetScale),
          height: Math.ceil(planet.height * planetScale),
          radius: planet.radius * planetScale,
          top: planet.glow * planetScale,
        },
      };
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
        scrollY: () => scrollY.get(),
      });
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, [prefersReducedMotion, progress, scrollY]);

  const reveal = {
    initial: false,
    animate: { opacity: painted ? 1 : 0 },
    transition: { duration: prefersReducedMotion ? 0 : 2.4, ease: easing.smooth },
  };

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[-1] min-h-lvh overflow-hidden bg-[#09080e]">
      <m.div className="absolute inset-0" {...reveal}>
        <m.canvas
          ref={skyRef}
          className="absolute inset-x-0 top-0 block h-[140lvh] w-full will-change-transform"
          style={{ y: prefersReducedMotion ? 0 : skyY }}
        />
        <m.canvas
          ref={dustRef}
          className="absolute inset-x-0 top-0 block h-[140lvh] w-full will-change-transform"
          style={{ y: prefersReducedMotion ? 0 : dustY }}
        />
      </m.div>

      <canvas ref={starsRef} className="absolute inset-x-0 top-0 block w-full" />

      <m.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: painted && showPlanet ? 1 : 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : showPlanet ? 2.4 : 0.6,
          ease: easing.smooth,
        }}
      >
        <m.canvas
          ref={planetRef}
          className="absolute inset-x-0 top-full block w-full will-change-transform"
          style={{ y: prefersReducedMotion ? planetRest : planetY }}
        />
      </m.div>

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
