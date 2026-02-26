import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { certifications, type Certification } from '../../data/certifications';
import { Eye } from 'lucide-react';
import CertificationModal from './CertificationModal';

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // === HEADER VARIANTS ===
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
    <section className="relative bg-transparent py-14 md:py-18 min-h-[80vh] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* === HEADER === */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="overflow-hidden mb-4">
            <motion.h2
              variants={wordVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-monument font-black tracking-tight text-white uppercase"
            >
              CERTIFICATIONS
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-slate-400 text-lg md:text-xl font-sans tracking-wide max-w-2xl mx-auto"
            >
              Records of achievements and credentials
            </motion.p>
          </div>
        </motion.div>

        {/* === HORIZONTAL SLIDER === */}
        <HorizontalSlider onCertClick={setSelectedCert} />
      </div>

      {/* === LIGHTBOX MODAL === */}
      <CertificationModal
        cert={selectedCert}
        isOpen={selectedCert !== null}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};

const HorizontalSlider = ({ onCertClick }: { onCertClick: (cert: Certification) => void }) => {
  const [width, setWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // === CALCULATE DRAG CONSTRAINTS ===
  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return;
    
    const updateWidth = () => {
      if (sliderRef.current && containerRef.current) {
        setWidth(sliderRef.current.scrollWidth - containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* === UNIFIED DRAGGABLE SLIDER (MOBILE + DESKTOP) === */}
      <motion.div
        className="flex gap-4 md:gap-6 lg:gap-8 cursor-grab active:cursor-grabbing pb-8 pr-4 md:pr-8"
        style={{ touchAction: 'pan-y' }}
        ref={sliderRef}
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        whileTap={{ cursor: "grabbing" }}
      >
        {certifications.map((cert, index) => (
          <CertificateCard key={cert.id} cert={cert} index={index} onCertClick={onCertClick} />
        ))}
      </motion.div>
    </div>
  );
};

interface CertificateCardProps {
  cert: Certification;
  index: number;
  onCertClick: (cert: Certification) => void;
}

const CertificateCard = ({ cert, index, onCertClick }: CertificateCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef(false);

  return (
    <motion.article
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={() => { dragRef.current = false; }}
      onPointerMove={() => { dragRef.current = true; }}
      onPointerUp={() => {
        if (!dragRef.current) onCertClick(cert);
      }}
      className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] select-none cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl group transition-colors duration-300 hover:border-white/30">
        
        {/* === IMAGE === */}
        <div className="absolute inset-0 bg-black/50">
          <img
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        {/* === GRADIENT OVERLAY === */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* === CONTENT === */}
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 space-y-3">
          <span className="inline-block px-3 py-1.5 bg-cyan-500/10 backdrop-blur-md rounded border border-cyan-400/30 text-xs font-mono text-cyan-400 tracking-wide">
            {cert.date}
          </span>

          {/* Title & Issuer */}
          <div className="space-y-1">
            <h3 className="text-lg lg:text-xl font-bold text-white leading-tight line-clamp-2">
              {cert.title}
            </h3>
            <p className="text-xs font-mono text-slate-400 line-clamp-1">
              {cert.issuer}
            </p>
          </div>

          {/* View Certificate Button */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg"
          >
            <span>View Certificate</span>
            <Eye size={14} />
          </motion.span>
        </div>

        {/* === HOVER GLOW EFFECT === */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" // Changed to White
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

      </div>
    </motion.article>
  );
};

export default Certifications;