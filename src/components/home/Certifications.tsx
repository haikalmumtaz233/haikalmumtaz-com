import { useRef, useState, useEffect, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { certifications, type Certification } from '../../data/certifications';
import CertificationModal from './CertificationModal';
import OptimizedImage from '../ui/OptimizedImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  animatedProps,
  maskedWordVariants,
  revealEase,
  staggerContainerVariants,
} from '../../lib/motion';
import { activateOnEnterOrSpace } from '../../lib/keyboard';
import { accents } from '../../data/categoryAccents';

const Certifications = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const titleVariants = staggerContainerVariants(prefersReducedMotion);
  const wordVariants = maskedWordVariants(prefersReducedMotion);
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [maxOffset, setMaxOffset] = useState(0);
  const [step, setStep] = useState(0);
  const [offset, setOffset] = useState(0);
  const x = useMotionValue(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    if (!slider || !container) return;

    const measure = () => {
      setMaxOffset(Math.max(0, slider.scrollWidth - container.offsetWidth));
      const firstCard = slider.firstElementChild as HTMLElement | null;
      const secondCard = firstCard?.nextElementSibling as HTMLElement | null;
      const measuredStep =
        firstCard && secondCard
          ? secondCard.offsetLeft - firstCard.offsetLeft
          : firstCard?.offsetWidth ?? 0;
      setStep(measuredStep);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(slider);
    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const slideTo = (nextOffset: number) => {
    const clamped = Math.min(maxOffset, Math.max(0, nextOffset));
    setOffset(clamped);
    animate(x, -clamped, prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: revealEase });
  };

  const isAtStart = offset <= 0;
  const isAtEnd = maxOffset === 0 || offset >= maxOffset;

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      slideTo(offset + step);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      slideTo(offset - step);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          onClick={() => slideTo(offset - step)}
          disabled={isAtStart}
          aria-label="Previous certificate"
          className={`p-2.5 rounded-full border transition-colors duration-300 ${
            isAtStart
              ? 'bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => slideTo(offset + step)}
          disabled={isAtEnd}
          aria-label="Next certificate"
          className={`p-2.5 rounded-full border transition-colors duration-300 ${
            isAtEnd
              ? 'bg-white/[0.02] border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        className="relative"
        ref={containerRef}
        role="group"
        aria-label="Certificates carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <motion.div
          className="flex gap-4 md:gap-6 lg:gap-8 cursor-grab active:cursor-grabbing pb-8 pr-4 md:pr-8"
          style={{ touchAction: 'pan-y', x }}
          ref={sliderRef}
          drag="x"
          dragConstraints={{ right: 0, left: -maxOffset }}
          onDragEnd={() => setOffset(-x.get())}
          whileTap={{ cursor: 'grabbing' }}
        >
          {certifications.map((cert, index) => (
            <CertificateCard key={cert.id} cert={cert} index={index} onCertClick={onCertClick} />
          ))}
        </motion.div>
      </div>
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const dragRef = useRef(false);

  return (
    <motion.article
      {...animatedProps(prefersReducedMotion, {
        initial: { opacity: 0, x: 50 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.6, delay: index * 0.1 },
      })}
      onPointerDown={() => { dragRef.current = false; }}
      onPointerMove={() => { dragRef.current = true; }}
      onPointerUp={() => { if (!dragRef.current) onCertClick(cert); }}
      onKeyDown={activateOnEnterOrSpace(() => onCertClick(cert))}
      role="button"
      tabIndex={0}
      aria-label={`View ${cert.title} certificate from ${cert.issuer}`}
      className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[280px] lg:w-[320px] 2xl:w-[360px] select-none cursor-pointer group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl transition-colors duration-300 group-hover:border-white/30">
        <div className="absolute inset-0 bg-black/50">
          <OptimizedImage
            src={cert.image}
            alt={`${cert.title} certificate from ${cert.issuer}`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            containerClassName="w-full h-full"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1 text-white text-xs md:text-sm font-semibold tracking-wide px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 pointer-events-none">
            View Certificate <ArrowUpRight className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' size={18} />
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 2xl:p-6 space-y-2">
          <span
            className="inline-block px-2.5 py-1 backdrop-blur-md rounded border text-[10px] font-mono tracking-wide"
            style={{
              backgroundColor: `${accents.cyan}1a`,
              borderColor: `${accents.cyan}4d`,
              color: accents.cyan,
            }}
          >
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
