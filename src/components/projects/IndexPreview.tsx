import { useEffect, useRef, useState } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import type { Project } from '../../data/projects';
import { easing } from '../../lib/motion';

const PREVIEW_WIDTH = 320;
const PREVIEW_HEIGHT = 200;
const CURSOR_GAP = 36;
const EDGE_GAP = 16;
const follow = { stiffness: 320, damping: 34, mass: 0.6 };

interface IndexPreviewProps {
  projects: Project[];
  active: Project | null;
}

const IndexPreview = ({ projects, active }: IndexPreviewProps) => {
  const [hasShown, setHasShown] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, follow);
  const springY = useSpring(y, follow);
  const isVisible = useRef(false);

  if (active && !hasShown) setHasShown(true);

  useEffect(() => {
    isVisible.current = active !== null;
  }, [active]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const maxLeft = window.innerWidth - PREVIEW_WIDTH - EDGE_GAP;
      const left = Math.min(Math.max(event.clientX - PREVIEW_WIDTH / 2, EDGE_GAP), maxLeft);
      const above = event.clientY - CURSOR_GAP - PREVIEW_HEIGHT;
      const top = above < EDGE_GAP ? event.clientY + CURSOR_GAP : above;
      x.set(left);
      y.set(top);
      if (!isVisible.current) {
        springX.jump(left);
        springY.jump(top);
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y, springX, springY]);

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50"
      style={{ x: springX, y: springY, width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
    >
      <m.div
        className="relative h-full w-full overflow-hidden rounded-xl border border-white/15 bg-[#0a0a0a] shadow-2xl"
        initial={false}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.45, ease: easing.expo }}
      >
        {hasShown &&
          projects.map((project) => (
            <img
              key={project.id}
              src={project.image}
              alt=""
              decoding="async"
              draggable={false}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                project.id === active?.id ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
      </m.div>
    </m.div>
  );
};

export default IndexPreview;
