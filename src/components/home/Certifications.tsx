import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { certifications } from '../../data/certifications';
import { ExternalLink } from 'lucide-react';

const Certifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const centerIndex = Math.floor(certifications.length / 2);
  
  const totalSpreadWidth = 85; 
  const dynamicGap = certifications.length > 1 
    ? totalSpreadWidth / (certifications.length - 1) 
    : 0;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] h-[300vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center perspective-1000">
        
        {/* === TITLE === */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute top-8 md:top-12 z-0 text-center px-4"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white/10 uppercase tracking-tighter leading-none mb-2">
            Certifications
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-mono uppercase tracking-widest">
            Achievements & Awards
          </p>
        </motion.div>

        {/* === CARDS CONTAINER === */}
        <div className="relative w-full max-w-[90vw] md:max-w-7xl h-[60vh] flex items-center justify-center">
          {certifications.map((cert, index) => {
            const offset = index - centerIndex;
            
            const x = useTransform(scrollYProgress, [0, 1], ["0%", `${offset * dynamicGap}%`]);
            const rotate = useTransform(scrollYProgress, [0, 1], [0, offset * 5]);
            const y = useTransform(scrollYProgress, [0, 1], [0, Math.abs(offset) * 15]);

            const isHovered = hoveredId === cert.id;

            return (
              <motion.div
                key={cert.id}
                style={{
                  x,
                  rotate, 
                  y,
                  zIndex: isHovered ? 50 : 20 - Math.abs(offset), 
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                
                onHoverStart={() => setHoveredId(cert.id)}
                onHoverEnd={() => setHoveredId(null)}
                
                className="absolute origin-bottom cursor-pointer"
              >
                {/* === VISUAL LAYER (Inner) === */}
                <motion.div
                  animate={{
                    scale: isHovered ? 1.15 : 1, 
                    y: isHovered ? -40 : 0,     
                  }}
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeOut" 
                  }}
                  className="relative w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl group"
                >
                  {/* Image */}
                  <div className="absolute inset-0 bg-gray-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

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

                    {/* Credential Button */}
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

                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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