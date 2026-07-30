import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { moments } from '../../data/moments';
import OptimizedImage from '../ui/OptimizedImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { maskedWordVariants, staggerContainerVariants } from '../../lib/motion';

const withoutFixedWidth = (className: string) =>
  className
    .split(' ')
    .filter((token) => !token.includes('w-['))
    .join(' ');

const FavoriteMoments = () => {
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

  const titleVariants = staggerContainerVariants(prefersReducedMotion);
  const wordVariants = maskedWordVariants(prefersReducedMotion);

  const getAlignmentClass = (alignment: 'start' | 'center' | 'end') => {
    switch (alignment) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
    }
  };

  const renderContent = (moment: typeof moments[0], imageSizeClass = moment.className) => {
    const textBlock = (
      <div className="space-y-2 md:space-y-3">
        <p className="text-[9px] sm:text-[10px] md:text-xs font-mono tabular-nums tracking-[0.2em] text-slate-400 uppercase">
          {moment.year}
        </p>
        <h3 className="text-base sm:text-lg md:text-3xl 2xl:text-4xl font-black text-white uppercase tracking-tight leading-none">
          {moment.title}
        </h3>
      </div>
    );

    const imageBlock = (
      <div className={`relative overflow-hidden rounded-lg ${imageSizeClass} group`}>
        <OptimizedImage
          src={moment.image}
          alt={moment.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          containerClassName="w-full h-full"
        />
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
      <h2 className="text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl font-monument font-black text-white uppercase tracking-tight leading-none">
        Favorite
      </h2>
      <h2 className="text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl font-monument font-black text-white uppercase tracking-tight leading-none">
        Moments
      </h2>
      <p className="text-slate-400 text-sm md:text-base 2xl:text-xl max-w-md font-light mt-4 md:mt-6">
        A collection of moments that shaped my journey through tech, education, and personal growth.
      </p>
    </>
  );

  if (prefersReducedMotion) {
    return (
      <section className="relative bg-transparent py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-12">
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
          className="flex items-stretch gap-6 md:gap-16 lg:gap-24 2xl:gap-32 px-4 md:px-12 pr-12 md:pr-24 2xl:pr-32"
        >
          <div className="flex-shrink-0 flex items-center justify-center w-[85vw] md:w-[420px] 2xl:w-[500px] h-[80vh]">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-left"
            >
              <div className="overflow-hidden">
                <motion.h2
                  variants={wordVariants}
                  className="text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl font-monument font-black text-white uppercase tracking-tight leading-none"
                >
                  Favorite
                </motion.h2>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  variants={wordVariants}
                  className="text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl font-monument font-black text-white uppercase tracking-tight leading-none"
                >
                  Moments
                </motion.h2>
              </div>

              <div className="overflow-hidden mt-4 md:mt-6">
                <motion.p
                  variants={wordVariants}
                  className="text-slate-400 text-sm md:text-base 2xl:text-xl max-w-md font-light"
                >
                  A collection of moments that shaped my journey through tech, education, and personal growth.
                </motion.p>
              </div>
            </motion.div>
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

export default FavoriteMoments;
