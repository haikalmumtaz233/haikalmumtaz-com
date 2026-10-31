import { useEffect, useRef } from 'react';
import { m } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { animatedProps, easing } from '../lib/motion';
import { createSkyStars, createStarPainter } from '../lib/skyStars';

const MAX_DPR = 2;

const MenuSky = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const paint = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const painter = createStarPainter(ctx);
      for (const star of createSkyStars(width, height)) {
        painter.draw(star, star.x * width, star.y * height, 0.85);
      }
      ctx.globalAlpha = 1;
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 45% at 100% 0%, rgba(124, 92, 255, 0.32), transparent 70%), radial-gradient(60% 40% at 0% 70%, rgba(34, 158, 204, 0.16), transparent 75%), radial-gradient(50% 30% at 70% 45%, rgba(219, 72, 199, 0.1), transparent 80%)',
        }}
      />
      <m.canvas
        ref={canvasRef}
        {...animatedProps(prefersReducedMotion, {
          initial: { scale: 1.35, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 1.6, ease: easing.expo },
        })}
        className="absolute inset-0 block h-full w-full origin-top-right"
      />
    </div>
  );
};

export default MenuSky;
