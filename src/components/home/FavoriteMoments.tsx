import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { moments } from '../../data/moments';

const FavoriteMoments = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress of the entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Transform vertical scroll into horizontal movement
  // Start slightly in view (1%) and move left (-65% to show all images)
  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-65%']);

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
          className="flex gap-12 md:gap-16 px-6 md:px-12"
        >
          {/* === OPENING TITLE CARD === */}
          <div className="flex-shrink-0 flex items-center justify-center w-[500px] md:w-[600px] h-[70vh]">
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
                className="text-gray-400 text-lg md:text-xl mt-6 max-w-md"
              >
                Capturing the highlights of my journey in tech, education, and personal growth.
              </motion.p>
            </div>
          </div>

          {/* === IMAGE GALLERY === */}
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.43, 0.13, 0.23, 0.96] as const,
              }}
              className="flex-shrink-0 group cursor-pointer"
            >
              {/* === IMAGE CARD === */}
              <div
                className={`relative overflow-hidden rounded-2xl ${moment.className} grayscale hover:grayscale-0 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/20`}
              >
                <img
                  src={moment.image}
                  alt={moment.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* === OVERLAY GRADIENT === */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* === TEXT OVERLAY === */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3">
                    <span className="text-xs font-mono text-white uppercase tracking-wider">
                      {moment.category}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {moment.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}

          {/* === CLOSING SPACER === */}
          <div className="flex-shrink-0 w-[200px]" />
        </motion.div>
      </div>
    </section>
  );
};

export default FavoriteMoments;
