import { useRef, type ReactNode } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { tools } from '../../data/tools';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import FadeIn from '../../journey/FadeIn';

const BASE_SPEED = 1.6;
const HOVER_SPEED = 0.15;

const wrapPercent = (value: number) => ((((value + 50) % 50) + 50) % 50) - 50;

const Marquee = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const offset = useMotionValue(0);
  const direction = useRef(-1);
  const hoverTarget = useRef(1);
  const hoverFactor = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smoothVelocity, [-1500, 0, 1500], [-6, 0, 6]);
  const x = useTransform(offset, (value) => `${wrapPercent(value)}%`);

  useAnimationFrame((_, delta) => {
    if (!isInView) return;

    const velocity = boost.get();
    if (velocity < -0.05) direction.current = 1;
    else if (velocity > 0.05) direction.current = -1;

    hoverFactor.current += (hoverTarget.current - hoverFactor.current) * 0.08;

    const step = BASE_SPEED * (delta / 1000) * (1 + Math.abs(velocity)) * hoverFactor.current;
    offset.set(offset.get() + direction.current * step);
  });

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden relative flex"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
      onPointerEnter={() => { hoverTarget.current = HOVER_SPEED; }}
      onPointerLeave={() => { hoverTarget.current = 1; }}
    >
      <motion.div className="flex flex-shrink-0" style={{ x }}>
        {children}
      </motion.div>
    </div>
  );
};

const Tools = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const toolsTrack = prefersReducedMotion ? tools : [...tools, ...tools];

  const toolTiles = toolsTrack.map((tool, index) => (
    <div
      key={`${tool.name}-${index}`}
      className="group mr-3 flex h-14 flex-shrink-0 items-center gap-3 rounded-full border border-white/10 px-5 transition-colors duration-300 hover:border-white/30 md:mr-4 md:h-16 md:px-6"
    >
      <span className="flex h-6 w-6 items-center justify-center transition-transform duration-500 ease-expo group-hover:scale-110 md:h-7 md:w-7">
        <TechIcon
          icon={tool.icon}
          name={tool.name}
          className="object-contain grayscale opacity-60 transition-[filter,opacity] duration-300 group-hover:grayscale-0 group-hover:opacity-100"
        />
      </span>
      <span className="whitespace-nowrap text-[15px] text-white/60 transition-colors duration-300 group-hover:text-white md:text-base">
        {tool.name}
      </span>
    </div>
  ));

  return (
    <section className="relative overflow-hidden pb-24 md:pb-32 2xl:pb-40">
      <div className="shell">
        <FadeIn delay={0.1} className="mb-6 flex items-baseline justify-between gap-4 border-t border-white/15 pt-5 md:mb-8">
          <h3 className="text-base font-semibold text-white md:text-lg">Everyday tools</h3>
          <span className="text-sm tabular-nums text-white/40">{tools.length}</span>
        </FadeIn>
      </div>

      {prefersReducedMotion ? (
        <div className="shell flex flex-wrap gap-y-3">{toolTiles}</div>
      ) : (
        <Marquee>{toolTiles}</Marquee>
      )}
    </section>
  );
};

export default Tools;
