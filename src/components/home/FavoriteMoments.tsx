import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { moments } from '../../data/moments';

const FavoriteMoments = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress - ONLY when section is locked at top
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical scroll into horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-55%']);

  // Helper to get alignment class
  const getAlignmentClass = (alignment: 'start' | 'center' | 'end') => {
    switch (alignment) {
      case 'start':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'end':
        return 'justify-end';
    }
  };

  // Helper to render content based on text position
  const renderContent = (moment: typeof moments[0]) => {
    const textBlock = (
      <div className="space-y-3">
        <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-gray-500 uppercase">
          {moment.year}
        </p>
        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
          {moment.title}
        </h3>
      </div>
    );

    const imageBlock = (
      <div className={`relative overflow-hidden rounded-lg ${moment.className} group`}>
        <img
          src={moment.image}
          alt={moment.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
      </div>
    );

    // Layout based on textPos
    if (moment.textPos === 'above') {
      return (
        <div className="flex flex-col gap-6">
          {textBlock}
          {imageBlock}
        </div>
      );
    } else if (moment.textPos === 'below') {
      return (
        <div className="flex flex-col gap-6">
          {imageBlock}
          {textBlock}
        </div>
      );
    } else {
      // side
      return (
        <div className="flex items-center gap-8">
          {imageBlock}
          {textBlock}
        </div>
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] h-[400vh]"
    >
      {/* === STICKY CONTAINER === */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* === HORIZONTAL SCROLLING TRACK === */}
        <motion.div
          style={{ x }}
          className="flex items-stretch gap-24 md:gap-32 px-6 md:px-12"
        >
          {/* === OPENING TITLE CARD === */}
          <div className="flex-shrink-0 flex items-center justify-center w-[400px] md:w-[500px] h-[80vh]">
            <div className="text-left">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] as const }}
                className="text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
              >
                Favorite
                <br />
                <span className="text-gray-500">Moments</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] as const }}
                className="text-gray-400 text-lg md:text-xl mt-8 max-w-md font-light"
              >
                A curated collection of defining moments that shaped my journey through technology, education, and personal growth.
              </motion.p>
            </div>
          </div>

          {/* === EDITORIAL GALLERY (DRAMATIC ZIGZAG) === */}
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96] as const,
              }}
              className={`flex-shrink-0 flex flex-col h-[80vh] ${getAlignmentClass(moment.alignment)}`}
            >
              {renderContent(moment)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FavoriteMoments;
