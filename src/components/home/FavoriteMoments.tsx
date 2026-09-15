import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { moments } from '../../data/moments';
import OptimizedImage from '../ui/OptimizedImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import { useIsMobile } from '../../hooks/useMediaQuery';
import MomentsScatter from './MomentsScatter';

const withoutFixedWidth = (className: string) =>
  className
    .split(' ')
    .filter((token) => !token.includes('w-['))
    .join(' ');

const HorizontalMoments = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [horizontalDistance, setHorizontalDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;

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
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -horizontalDistance]);
  const imageDrift = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);

  const getAlignmentClass = (alignment: 'start' | 'center' | 'end') => {
    switch (alignment) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
    }
  };

  const renderContent = (moment: typeof moments[0], imageSizeClass = moment.className) => {
    const textBlock = (
      <div className="space-y-1.5">
        <p className="text-sm tabular-nums text-white/45">{moment.year}</p>
        <h3 className="text-lg font-semibold leading-tight text-white md:text-2xl 2xl:text-3xl">
          {moment.title}
        </h3>
      </div>
    );

    const imageBlock = (
      <div className={`relative overflow-hidden rounded-lg ${imageSizeClass} group`}>
        <motion.div
          className="w-full h-full"
          style={prefersReducedMotion ? undefined : { x: imageDrift, scale: 1.18 }}
        >
          <OptimizedImage
            src={moment.image}
            alt={moment.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-expo group-hover:scale-105"
            containerClassName="w-full h-full"
          />
        </motion.div>
      </div>
    );

    if (moment.textPos === 'above') {
      return <div className="flex flex-col gap-4 md:gap-6">{textBlock}{imageBlock}</div>;
    } else if (moment.textPos === 'below') {
      return <div className="flex flex-col gap-4 md:gap-6">{imageBlock}{textBlock}</div>;
    } else {
      return <div className="flex items-center gap-4 md:gap-8">{imageBlock}{textBlock}</div>;
    }
  };

  const heading = (
    <>
      <RuleReveal
        lines={['Favorite', 'moments']}
        className="font-monument font-black uppercase text-white tracking-tight leading-[0.95] text-[clamp(2rem,3.9vw,3.75rem)]"
      />
      <FadeIn>
        <p className="mt-6 max-w-xs text-base text-white/55 md:mt-8 2xl:text-lg">
          Events, teams, and milestones since 2022.
        </p>
      </FadeIn>
    </>
  );

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="relative section-space">
        <div className="shell">
          <div className="text-left mb-12 md:mb-16">{heading}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14">
            {moments.map((moment) => (
              <div key={moment.id}>
                {renderContent(moment, `${withoutFixedWidth(moment.className)} w-full`)}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent"
      style={{ height: `calc(100vh + ${horizontalDistance}px)` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-stretch gap-10 md:gap-16 lg:gap-24 2xl:gap-32 pl-5 sm:pl-8 lg:pl-12 min-[1320px]:pl-[calc((100vw-1320px)/2+3rem)] pr-12 md:pr-24 2xl:pr-32"
        >
          <div className="flex-shrink-0 flex items-center justify-start w-[80vw] md:w-[460px] 2xl:w-[560px] h-[80vh]">
            <div className="text-left">{heading}</div>
          </div>

          {moments.map((moment) => (
            <div
              key={moment.id}
              className={`flex-shrink-0 flex flex-col h-[80vh] ${getAlignmentClass(moment.alignment)}`}
            >
              {renderContent(moment)}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FavoriteMoments = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  if (isMobile && !prefersReducedMotion) return <MomentsScatter />;
  return <HorizontalMoments />;
};

export default FavoriteMoments;
