import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { certifications } from '../../data/certifications';
import { ExternalLink } from 'lucide-react';

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Separate transform values for mobile vs desktop
  const xDesktop = useTransform(scrollYProgress, [0, 1], ['0%', '-65%']);
  const xMobile = useTransform(scrollYProgress, [0, 1], ['0%', '-88%']);
  const x = isMobile ? xMobile : xDesktop;

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
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent h-[280vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div
          style={{ x }}
          className="flex items-center gap-4 md:gap-10 lg:gap-14 px-4 md:px-12 pr-8 md:pr-16"
        >
          {/* === TITLE CARD === */}
          <div className="flex-shrink-0 flex items-center justify-center w-[85vw] md:w-[450px] lg:w-[500px] h-[80vh]">
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
                  className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-monument font-black text-white uppercase tracking-tight leading-none"
                >
                  Certificates
                </motion.h2>
              </div>
              
              <div className="overflow-hidden mt-4 md:mt-8">
                <motion.p
                  variants={wordVariants}
                  className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-md font-light"
                >
                  Certificates & Awards
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* === CERTIFICATE CARDS === */}
          {certifications.map((cert, index) => {
            const isHovered = hoveredId === cert.id;
            
            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.43, 0.13, 0.23, 0.96] as const,
                }}
                onMouseEnter={() => setHoveredId(cert.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex-shrink-0 w-[75vw] md:w-[320px] lg:w-[360px] h-[80vh] flex items-center"
              >
                <motion.div
                  animate={{
                    y: isHovered ? -15 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
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
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
