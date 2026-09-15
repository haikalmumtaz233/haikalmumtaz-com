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
import RuleReveal from '../../journey/RuleReveal';
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
      className="w-28 h-28 md:w-32 md:h-32 2xl:w-36 2xl:h-36 mr-4 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-xl transition-all duration-300 group cursor-pointer"
    >
      <div className="w-8 h-8 md:w-10 md:h-10 2xl:w-12 2xl:h-12 flex items-center justify-center transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:scale-110">
        <TechIcon
          icon={tool.icon}
          name={tool.name}
          className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      </div>
      <span className="text-xs md:text-sm 2xl:text-base font-mono text-slate-400 group-hover:text-white transition-colors duration-300 text-center px-2">
        {tool.name}
      </span>
    </div>
  ));

  return (
    <section className="relative bg-transparent py-8 sm:py-12 md:py-16 2xl:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-8 sm:mb-10 2xl:mb-16">
          <RuleReveal
            lines={['Tools & Software']}
            align="center"
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black text-white uppercase tracking-tight mb-3"
          />
          <FadeIn>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl max-w-2xl mx-auto">
              My tools for development and design.
            </p>
          </FadeIn>
        </div>
      </div>

      {prefersReducedMotion ? (
        <div className="flex flex-wrap justify-center">{toolTiles}</div>
      ) : (
        <Marquee>{toolTiles}</Marquee>
      )}
    </section>
  );
};

export default Tools;
