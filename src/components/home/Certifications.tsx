import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { certifications } from '../../data/certifications';
import { ExternalLink } from 'lucide-react';

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll progress - ALWAYS call hooks (React rules)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const centerIndex = Math.floor(certifications.length / 2);
  
  const totalSpreadWidth = 80; 
  const dynamicGap = certifications.length > 1 
    ? totalSpreadWidth / (certifications.length - 1) 
    : 0;

  const compactGap = 40;

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

  // === MOBILE LAYOUT COMPONENT ===
  const MobileLayout = () => (
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
            className="text-4xl md:text-5xl lg:text-6xl font-monument font-black text-white uppercase tracking-tight mb-4"
          >
            Certifications
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.p
            variants={wordVariants}
            className="text-gray-400 text-base md:text-lg"
          >
            Certificates & Awards
          </motion.p>
        </div>
      </motion.div>

      {/* Horizontal Scrollable Cards - Mobile Optimized */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-4 px-6 pb-6 snap-x snap-mandatory scrollbar-hide scroll-smooth">
          {certifications.map((cert, index) => (
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
              className="flex-shrink-0 w-[280px] snap-center"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl">
                {/* Image */}
                <div className="absolute inset-0 bg-gray-900">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                  <span className="w-fit px-2.5 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] font-mono text-cyan-400 border border-white/10">
                    {cert.date}
                  </span>
                  
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                      {cert.issuer}
                    </p>
                  </div>

                  <a
                    href={cert.credentialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white mt-1 active:scale-95 transition-transform"
                  >
                    <span>View Credential</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center gap-1.5 mt-6">
          {certifications.map((_, index) => (
            <div key={index} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  );

  // === DESKTOP LAYOUT COMPONENT ===
  const DesktopLayout = () => (
    <section
      ref={sectionRef}
      className="relative bg-transparent h-[250vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center perspective-1000">
        
        {/* === TITLE === */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="absolute top-8 md:top-12 z-0 text-center px-4 mb-16"
        >
          <div className="overflow-hidden">
            <motion.h2
              variants={wordVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-monument font-black text-white uppercase tracking-tight mb-4"
            >
              Certifications
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Certificates & Awards
            </motion.p>
          </div>
        </motion.div>

        {/* === CARDS CONTAINER === */}
        <div className="relative w-full max-w-[90vw] md:max-w-7xl h-[60vh] flex items-center justify-center">
          {certifications.map((cert, index) => {
            const offset = index - centerIndex;

            const x = useTransform(
              scrollYProgress, 
              [0, 0.5, 1], 
              ["0%", `${offset * dynamicGap}%`, `${offset * compactGap}%`]
            );
            
            const rotate = useTransform(
              scrollYProgress, 
              [0, 0.5, 1], 
              [0, offset * 2, 0]
            );
            
            const y = useTransform(
              scrollYProgress, 
              [0, 0.5, 1], 
              [0, Math.abs(offset) * 5, 0] 
            );

            const scale = useTransform(
              scrollYProgress,
              [0, 0.5, 1],
              [0.85, 1, 0.9]
            );

            const isHovered = hoveredId === cert.id;

            return (
              <motion.div
                key={cert.id}
                style={{
                  x,
                  rotate, 
                  y,
                  scale,
                  zIndex: isHovered ? 100 : index,
                  willChange: isHovered ? 'transform' : 'auto',
                }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  ease: "easeOut" 
                }}
                
                onHoverStart={() => setHoveredId(cert.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="absolute origin-bottom cursor-pointer"
              >
                {/* === VISUAL LAYER === */}
                <motion.div
                  animate={{
                    scale: isHovered ? 1.05 : 1, 
                    y: isHovered ? -20 : 0,     
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="relative w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl group"
                >
                  {/* Image */}
                  <div className="absolute inset-0 bg-gray-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] font-mono text-cyan-400 border border-white/10">
                          {cert.date}
                       </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-1 line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {cert.issuer}
                      </p>
                    </div>

                    <motion.a
                      href={cert.credentialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white mt-2 group/link"
                    >
                      <span>View Credential</span>
                      <ExternalLink size={12} className="group-hover/link:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );

  // === CONDITIONAL RENDER ===
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default Certifications;