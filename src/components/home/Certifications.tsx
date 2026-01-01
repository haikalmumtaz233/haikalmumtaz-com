import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { certifications } from '../../data/certifications';
import { ExternalLink } from 'lucide-react';

const Certifications = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // === ANIMATION VARIANTS ===
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
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      },
    },
  };

  return (
    <section className="relative bg-transparent py-20 md:py-32 overflow-hidden">
      {/* Title */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="text-center px-4 mb-12"
      >
        <div className="overflow-hidden">
          <motion.h2
            variants={wordVariants}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-monument font-black text-white uppercase tracking-tight mb-4"
          >
            Certifications
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.p
            variants={wordVariants}
            className="text-gray-400 text-base md:text-lg xl:text-xl"
          >
            Certificates & Awards
          </motion.p>
        </div>
      </motion.div>

      {/* Horizontal Scrollable Cards */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 md:gap-6 px-6 md:px-12 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {certifications.map((cert, index) => {
            const isHovered = hoveredId === cert.id;
            
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                onMouseEnter={() => setHoveredId(cert.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] snap-center"
              >
                <motion.div
                  animate={{
                    y: isHovered ? -10 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="absolute inset-0 bg-gray-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      }}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col gap-2">
                    <span className="w-fit px-2.5 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] font-mono text-cyan-400 border border-white/10">
                      {cert.date}
                    </span>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-1 line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                        {cert.issuer}
                      </p>
                    </div>

                    <motion.a
                      href={cert.credentialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        height: isHovered ? 'auto' : 0 
                      }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white mt-1 hover:text-cyan-400 transition-colors"
                    >
                      <span>View Credential</span>
                      <ExternalLink size={12} />
                    </motion.a>
                  </div>

                  {/* Shine Effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent transition-opacity duration-300 pointer-events-none"
                    style={{
                      opacity: isHovered ? 1 : 0,
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Certifications;