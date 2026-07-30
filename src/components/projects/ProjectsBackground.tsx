import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const PARTICLE_DENSITY = 15000;
const LINK_DISTANCE = 150;
const GRID_SIZE = 60;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

const ProjectsBackground = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const particles: Particle[] = [];

    const populate = () => {
      particles.length = 0;
      const particleCount = Math.floor((width * height) / PARTICLE_DENSITY);
      const colors = ['6, 182, 212', '168, 85, 247', '236, 72, 153'];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      populate();
    };

    handleResize();

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

                  const opacity = (1 - Math.sqrt(squaredDistance) / LINK_DISTANCE) * 0.15;
                  ctx.beginPath();
                  ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
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

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      ctx.fill();
    };

    const paintScene = () => {
      ctx.fillStyle = '#0d0a12';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(drawParticle);
      linkNeighbours();

      const topGlow = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, 400);
      topGlow.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
      topGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, height);

      const bottomGlow = ctx.createRadialGradient(width * 0.2, height * 0.8, 0, width * 0.2, height * 0.8, 300);
      bottomGlow.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      bottomGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, 0, width, height);
    };

    if (prefersReducedMotion) {
      const handleStaticResize = () => {
        handleResize();
        paintScene();
      };

      paintScene();
      window.addEventListener('resize', handleStaticResize);

      return () => {
        window.removeEventListener('resize', handleStaticResize);
      };
    }

    const animate = () => {
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      }

      paintScene();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 z-[-1]">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==)',
        }}
      />
    </div>
  );
};

export default ProjectsBackground;
