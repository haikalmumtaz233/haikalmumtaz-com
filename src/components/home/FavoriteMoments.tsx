import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { moments } from '../../data/moments';

const FavoriteMoments = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);

  // === ANIMATION VARIANTS (Copied from TechStack) ===
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '100%' },
    visible: {
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      },
    },
  };

  const getAlignmentClass = (alignment: 'start' | 'center' | 'end') => {
    switch (alignment) {
      case 'start': return 'justify-start';
      case 'center': return 'justify-center';
      case 'end': return 'justify-end';
    }
  };

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
        {/* REVISI: Grayscale dihapus. Gambar langsung berwarna. */}
        <img
          src={moment.image}
          alt={moment.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    );

    if (moment.textPos === 'above') {
      return <div className="flex flex-col gap-6">{textBlock}{imageBlock}</div>;
    } else if (moment.textPos === 'below') {
      return <div className="flex flex-col gap-6">{imageBlock}{textBlock}</div>;
    } else {
      return <div className="flex items-center gap-8">{imageBlock}{textBlock}</div>;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent h-[400vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          style={{ x }}
          className="flex items-stretch gap-24 md:gap-32 px-6 md:px-12 pr-24 md:pr-32"
        >
          {/* === OPENING TITLE CARD (TECH STACK STYLE) === */}
          <div className="flex-shrink-0 flex items-center justify-center w-[400px] md:w-[500px] h-[80vh]">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-left"
            >
              {/* MASKED REVEAL ANIMATION */}
              <div className="overflow-hidden">
                <motion.h2
                  variants={wordVariants}
                  className="text-6xl md:text-7xl lg:text-8xl font-monument font-black text-white uppercase tracking-tight leading-none"
                >
                  Favorite
                </motion.h2>
              </div>
              
              <div className="overflow-hidden">
                <motion.h2
                  variants={wordVariants}
                  className="text-6xl md:text-7xl lg:text-8xl font-monument font-black text-gray-500 uppercase tracking-tight leading-none"
                >
                  Moments
                </motion.h2>
              </div>

              <div className="overflow-hidden mt-8">
                <motion.p
                  variants={wordVariants}
                  className="text-gray-400 text-lg md:text-xl max-w-md font-light"
                >
                  A curated collection of defining moments that shaped my journey through technology, education, and personal growth.
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* === EDITORIAL GALLERY === */}
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