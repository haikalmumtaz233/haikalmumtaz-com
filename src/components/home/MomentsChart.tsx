import { useEffect, useRef, useState } from 'react';
import { m, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { moments } from '../../data/moments';
import { chartMarker, passedNodes, revealFraction, yearGroups } from '../../lib/momentsChart';
import { useAnchorPoints } from '../../hooks/useAnchorPoints';
import { useIsMobile } from '../../hooks/useMediaQuery';
import MomentsIntro from './MomentsIntro';
import MomentPlate from './MomentPlate';
import MomentsConstellation from './MomentsConstellation';

const DRIFT_SPEEDS = [36, -28, 22, -36, 28, -22, 32, -26, 20];
const NODE_LIFT = 34;
const MARKER_RATIO = 0.55;
const groupStarts = new Set(yearGroups(moments).map((group) => group.start));

const alignmentClass = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
} as const;

const MomentsChart = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [horizontalDistance, setHorizontalDistance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const points = useAnchorPoints(trackRef, '[data-moment-anchor]', NODE_LIFT, true);
  const pointsRef = useRef(points);
  const distanceRef = useRef(0);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    distanceRef.current = horizontalDistance;
  }, [horizontalDistance]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measureOverflow = () => {
      setHorizontalDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measureOverflow();
    const resizeObserver = new ResizeObserver(measureOverflow);
    resizeObserver.observe(track);
    window.addEventListener('resize', measureOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureOverflow);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -horizontalDistance]);
  const trackState = (rawProgress: number) => {
    const progress = Math.min(1, Math.max(0, rawProgress));
    const offset = -distanceRef.current * progress;
    const marker = chartMarker(
      pointsRef.current,
      distanceRef.current,
      window.innerWidth * MARKER_RATIO,
      progress,
    );
    return { offset, marker };
  };

  const reveal = useTransform(() => {
    const { offset, marker } = trackState(scrollYProgress.get());
    return revealFraction(pointsRef.current, offset, marker);
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const { offset, marker } = trackState(progress);
    setActiveIndex(passedNodes(pointsRef.current, offset, marker));
  });

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100svh + ${horizontalDistance}px)` }}
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <m.div
          ref={trackRef}
          style={{ x }}
          className="relative flex items-stretch gap-10 pr-[12vw] pl-5 sm:gap-14 sm:pr-24 sm:pl-8 lg:gap-24 lg:pl-12 2xl:gap-32 2xl:pr-32 min-[1320px]:pl-[calc((100vw-1320px)/2+3rem)]"
        >
          <MomentsConstellation points={points} reveal={reveal} activeIndex={activeIndex} />

          <div className="flex h-[70svh] w-[82vw] shrink-0 md:h-[78svh] items-center sm:w-[460px] 2xl:w-[560px]">
            <MomentsIntro
              showHint
              titleClassName="font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2.4rem,12vw,3.5rem)] md:text-[clamp(2rem,3.9vw,3.75rem)]"
            />
          </div>

          {moments.map((moment, index) => (
            <div
              key={moment.id}
              className={`relative flex h-[70svh] shrink-0 flex-col pt-14 md:h-[78svh] ${isMobile ? 'w-[78vw]' : ''} ${alignmentClass[moment.alignment]}`}
            >
              {groupStarts.has(index) && (
                <span
                  aria-hidden="true"
                  data-decorative
                  className="pointer-events-none absolute -top-6 left-0 font-monument text-[clamp(4.5rem,10vw,9rem)] leading-none font-black text-white/[0.07] select-none"
                >
                  {moment.year}
                </span>
              )}
              <MomentPlate
                moment={moment}
                progress={scrollYProgress}
                speed={DRIFT_SPEEDS[index % DRIFT_SPEEDS.length]}
                fluid={isMobile}
              />
            </div>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default MomentsChart;
