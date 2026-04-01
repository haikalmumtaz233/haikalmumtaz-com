import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { certifications, type Certification } from '../../data/certifications';
import CertificationModal from './CertificationModal';

const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const wordVariants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] as const },
  },
};

const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section className="relative bg-transparent py-8 sm:py-12 md:py-16 2xl:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-8 sm:mb-12 md:mb-14 2xl:mb-20"
        >
          <div className="overflow-hidden mb-3">
            <motion.h2
              variants={wordVariants}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black tracking-tight text-white uppercase"
            >
              CERTIFICATIONS
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl font-sans tracking-wide max-w-2xl mx-auto"
            >
              Records of achievements and credentials
            </motion.p>
          </div>
        </motion.div>

        <HorizontalSlider onCertClick={setSelectedCert} />
      </div>

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
      <motion.div
        className="flex gap-4 md:gap-6 lg:gap-8 cursor-grab active:cursor-grabbing pb-8 pr-4 md:pr-8"
        style={{ touchAction: 'pan-y' }}
        ref={sliderRef}
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {certifications.map((cert, index) => (
          <CertificateCard key={cert.id} cert={cert} index={index} onCertClick={onCertClick} />
        ))}
      </motion.div>
    </div>
  );
};

const CertificateCard = ({
  cert,
  index,
  onCertClick,
}: {
  cert: Certification;
  index: number;
  onCertClick: (cert: Certification) => void;
}) => {
  const dragRef = useRef(false);

  return (
    <motion.article
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onPointerDown={() => { dragRef.current = false; }}
      onPointerMove={() => { dragRef.current = true; }}
      onPointerUp={() => { if (!dragRef.current) onCertClick(cert); }}
      className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[280px] lg:w-[320px] 2xl:w-[360px] select-none cursor-pointer group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl transition-colors duration-300 group-hover:border-white/30">
        <div className="absolute inset-0 bg-black/50">
          <img
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 text-white text-xs md:text-sm font-semibold tracking-wide backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 pointer-events-none">
            View Certificate <ArrowUpRight size={14} />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 2xl:p-6 space-y-2">
          <span className="inline-block px-2.5 py-1 bg-cyan-500/10 backdrop-blur-md rounded border border-cyan-400/30 text-[10px] font-mono text-cyan-400 tracking-wide">
            {cert.date}
          </span>

          <div className="space-y-1">
            <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-white leading-tight line-clamp-2">
              {cert.title}
            </h3>
            <p className="text-xs font-mono text-slate-400 line-clamp-1">
              {cert.issuer}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default Certifications;
