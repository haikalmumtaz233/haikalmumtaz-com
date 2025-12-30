import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { certifications } from '../../data/certifications';

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const centerIndex = Math.floor(certifications.length / 2);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] h-[300vh]"
    >
      {/* === STICKY CONTAINER === */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* === TITLE === */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] as const }}
          className="absolute top-2 md:top-4 -translate-x-1/2 z-0"
        >
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white/50 uppercase tracking-tighter leading-none text-center">
            Certifications & Awards
          </h2>
        </motion.div>

        {/* === CARDS CONTAINER === */}
        <div className="relative w-full h-full flex items-center justify-center">
          {certifications.map((cert, index) => {
            // Calculate transforms based on scroll and position
            const offset = index - centerIndex;
            const x = useTransform(scrollYProgress, [0, 1], [0, offset * 250]);
            const rotate = useTransform(scrollYProgress, [0, 1], [0, offset * 10]);
            const y = useTransform(
              scrollYProgress,
              [0, 1],
              [0, index === centerIndex ? -20 : 0]
            );

            const isHovered = hoveredId === cert.id;

            return (
              <motion.div
                key={cert.id}
                style={{
                  x: x, // Keep original fan position!
                  y: isHovered ? -50 : y,
                  rotate: isHovered ? 0 : rotate,
                  zIndex: isHovered ? 100 : 10 - Math.abs(offset),
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.43, 0.13, 0.23, 0.96] as const,
                }}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredId(cert.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="absolute cursor-pointer"
              >
                {/* === CARD === */}
                <div className="relative w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-2xl">
                  {/* === IMAGE === */}
                  <div className="absolute inset-0">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>

                  {/* === GRADIENT OVERLAY === */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* === CONTENT === */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-xs font-mono tracking-wider text-gray-400 uppercase mb-2">
                      {cert.date}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {cert.issuer}
                    </p>

                    {/* === CREDENTIAL LINK === */}
                    {isHovered && (
                      <motion.a
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="inline-block mt-4 text-xs font-mono text-cyan-400 hover:text-cyan-300 border-b border-cyan-400/50 hover:border-cyan-300 transition-colors"
                      >
                        View Credential →
                      </motion.a>
                    )}
                  </div>

                  {/* === HOVER GLOW === */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* === SCROLL INDICATOR === */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            Scroll to Spread
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-2 w-6 h-6 mx-auto border-2 border-gray-600 rounded-full flex items-center justify-center"
          >
            <div className="w-1 h-2 bg-gray-600 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
