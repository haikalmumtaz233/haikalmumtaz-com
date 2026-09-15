import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { setIntroPhase } from '../lib/intro';
import { runIntroScene } from '../lib/introScene';

const Intro = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(() => {
    if (prefersReducedMotion) return true;
    setIntroPhase('playing');
    return false;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const backdrop = backdropRef.current;
    if (isDone || !canvas || !backdrop) return;

    return runIntroScene(canvas, {
      backdrop,
      onFormed: () => setIntroPhase('formed'),
      onDone: () => {
        setIntroPhase('done');
        setIsDone(true);
      },
    });
  }, [isDone]);

  if (isDone) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={backdropRef} className="absolute inset-0 bg-[#09080e]" style={{ willChange: 'opacity' }} />
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
};

export default Intro;
