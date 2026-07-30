import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { palette } from '../design/tokens';
import { hexToRgbChannels } from '../lib/color';

const STAR_DENSITY = 8000;
const PARTICLE_DENSITY = 22000;
const LINK_DISTANCE = 150;
const GRID_SIZE = 60;

const nilaChannels = hexToRgbChannels(palette.nila);
const jadeChannels = hexToRgbChannels(palette.jade);

interface Star {
  x: number;
  y: number;
  depth: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const Background = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const lightY = useTransform(scrollYProgress, [0, 1], ['-8%', '38%']);
  const lightOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 0.32, 0.2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let scrollVelocity = 0;

    const stars: Star[] = [];
    const particles: Particle[] = [];

    const createStar = (): Star => {
      const colors = ['255, 255, 255', '220, 250, 255', '240, 230, 255'];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        depth: Math.random() * 1.5 + 0.5,
        size: Math.random() * 1.2,
        baseAlpha: Math.random() * 0.55 + 0.4,
        alpha: Math.random() * 0.55 + 0.4,
        twinkleSpeed: Math.random() * 0.01 + 0.002,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.4 + 0.15,
      color: Math.random() > 0.85 ? jadeChannels : nilaChannels,
    });

    const populate = () => {
      stars.length = 0;
      particles.length = 0;
      const starCount = Math.floor((width * height) / STAR_DENSITY);
      const particleCount = Math.floor((width * height) / PARTICLE_DENSITY);
      for (let i = 0; i < starCount; i++) stars.push(createStar());
      for (let i = 0; i < particleCount; i++) particles.push(createParticle());
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      populate();
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX - width / 2) * 0.02;
      targetMouseY = (event.clientY - height / 2) * 0.02;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    handleResize();

    const drawStar = (star: Star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * (star.depth * 0.8), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${Math.max(0, star.alpha)})`;
      ctx.fill();
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      ctx.fill();
    };

    const linkNeighbours = () => {
      const columns = Math.max(1, Math.ceil(width / LINK_DISTANCE));
      const rows = Math.max(1, Math.ceil(height / LINK_DISTANCE));
      const buckets: number[][] = Array.from({ length: columns * rows }, () => []);

      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index];
        const column = Math.min(columns - 1, Math.max(0, Math.floor(particle.x / LINK_DISTANCE)));
        const row = Math.min(rows - 1, Math.max(0, Math.floor(particle.y / LINK_DISTANCE)));
        buckets[row * columns + column].push(index);
      }

      ctx.lineWidth = 0.5;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const bucket = buckets[row * columns + column];
          if (bucket.length === 0) continue;

          for (let neighbourRow = row; neighbourRow <= row + 1; neighbourRow++) {
            if (neighbourRow >= rows) continue;

            for (let neighbourColumn = column - 1; neighbourColumn <= column + 1; neighbourColumn++) {
              if (neighbourColumn < 0 || neighbourColumn >= columns) continue;
              if (neighbourRow === row && neighbourColumn < column) continue;

              const neighbourBucket = buckets[neighbourRow * columns + neighbourColumn];
              const sameBucket = neighbourRow === row && neighbourColumn === column;

              for (let a = 0; a < bucket.length; a++) {
                const startIndex = sameBucket ? a + 1 : 0;

                for (let b = startIndex; b < neighbourBucket.length; b++) {
                  const first = particles[bucket[a]];
                  const second = particles[neighbourBucket[b]];
                  const dx = first.x - second.x;
                  const dy = first.y - second.y;
                  const squaredDistance = dx * dx + dy * dy;
                  if (squaredDistance >= LINK_DISTANCE * LINK_DISTANCE) continue;

                  const opacity = (1 - Math.sqrt(squaredDistance) / LINK_DISTANCE) * 0.14;
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(${nilaChannels}, ${opacity})`;
                  ctx.moveTo(first.x, first.y);
                  ctx.lineTo(second.x, second.y);
                  ctx.stroke();
                }
              }
            }
          }
        }
      }
    };

    const renderStaticField = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach(drawStar);
      particles.forEach(drawParticle);
      linkNeighbours();
    };

    if (prefersReducedMotion) {
      const handleStaticResize = () => {
        handleResize();
        renderStaticField();
      };

      renderStaticField();
      window.addEventListener('resize', handleStaticResize);

      return () => {
        window.removeEventListener('resize', handleStaticResize);
      };
    }

    const advanceParallax = () => {
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const scrollDiff = targetScrollY - scrollY;
      scrollVelocity += (scrollDiff - scrollVelocity) * 0.1;
      scrollY += scrollVelocity;
    };

    const wrap = (value: number, max: number) => {
      if (value < 0) return max;
      if (value > max) return 0;
      return value;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      advanceParallax();

      for (const star of stars) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < star.baseAlpha - 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        star.x -= mouseX * star.depth * 0.05;
        star.y -= mouseY * star.depth * 0.05;
        star.y += scrollVelocity * star.depth * 0.2;
        star.y -= 0.2 * star.depth;

        star.x = wrap(star.x, width);
        star.y = wrap(star.y, height);

        drawStar(star);
      }

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.x = wrap(particle.x, width);
        particle.y = wrap(particle.y, height);
        drawParticle(particle);
      }

      linkNeighbours();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 z-[-1] bg-ink">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(${nilaChannels}, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(${nilaChannels}, 0.05) 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />

      <motion.div
        className="absolute inset-x-0 -top-[10%] h-[70vh] pointer-events-none"
        style={{
          y: prefersReducedMotion ? '0%' : lightY,
          opacity: prefersReducedMotion ? 0.34 : lightOpacity,
          background: `radial-gradient(60% 55% at 68% 0%, rgba(${hexToRgbChannels(palette.sogan)}, 0.28) 0%, rgba(${nilaChannels}, 0.16) 45%, transparent 78%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 25%, ${palette.ink} 100%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
        }}
      />
    </div>
  );
};

export default Background;
