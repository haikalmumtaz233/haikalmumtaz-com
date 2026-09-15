import { useRef, useState, useEffect, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { certifications, type Certification } from '../../data/certifications';
import CertificationModal from './CertificationModal';
import OptimizedImage from '../ui/OptimizedImage';
import SectionHeader from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';
import { activateOnEnterOrSpace } from '../../lib/keyboard';

const navButtonClass = (isDisabled: boolean) =>
  `flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
    isDisabled
      ? 'cursor-not-allowed border-white/5 text-white/20'
      : 'border-white/20 text-white hover:border-white/50 hover:bg-white/5'
  }`;

const Certifications = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
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
      setStep(
        firstCard && secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : firstCard?.offsetWidth ?? 0
      );
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(slider);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const slideTo = (nextOffset: number) => {
    const clamped = Math.min(maxOffset, Math.max(0, nextOffset));
    setOffset(clamped);
    animate(x, -clamped, prefersReducedMotion ? { duration: 0 } : { duration: 0.9, ease: easing.expo });
  };

  const isAtStart = offset <= 1;
  const isAtEnd = maxOffset === 0 || offset >= maxOffset - 1;

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
    <section className="relative section-space overflow-x-clip">
      <div className="shell">
        <SectionHeader
          title={['Certifications']}
          meta={
            <div className="flex items-center gap-4">
              <span className="text-sm md:text-base text-white/55">{certifications.length} credentials</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => slideTo(offset - step)}
                  disabled={isAtStart}
                  aria-label="Previous certificates"
                  className={navButtonClass(isAtStart)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => slideTo(offset + step)}
                  disabled={isAtEnd}
                  aria-label="Next certificates"
                  className={navButtonClass(isAtEnd)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          }
        />

        <div
          ref={containerRef}
          role="group"
          aria-label="Certificates"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="rounded-lg"
        >
          <motion.div
            ref={sliderRef}
            className="flex cursor-grab gap-5 active:cursor-grabbing md:gap-8"
            style={{ touchAction: 'pan-y', x }}
            drag="x"
            dragConstraints={{ right: 0, left: -maxOffset }}
            onDragEnd={() => setOffset(-x.get())}
          >
            {certifications.map((cert) => (
              <CertificateCard key={cert.id} cert={cert} onCertClick={setSelectedCert} />
            ))}
          </motion.div>
        </div>
      </div>

      <CertificationModal cert={selectedCert} isOpen={selectedCert !== null} onClose={() => setSelectedCert(null)} />
    </section>
  );
};

const CertificateCard = ({
  cert,
  onCertClick,
}: {
  cert: Certification;
  onCertClick: (cert: Certification) => void;
}) => {
  const dragRef = useRef(false);

  return (
    <article
      onPointerDown={() => {
        dragRef.current = false;
      }}
      onPointerMove={(event) => {
        if (event.buttons > 0) dragRef.current = true;
      }}
      onPointerUp={() => {
        if (!dragRef.current) onCertClick(cert);
      }}
      onKeyDown={activateOnEnterOrSpace(() => onCertClick(cert))}
      role="button"
      tabIndex={0}
      aria-label={`View ${cert.title} certificate from ${cert.issuer}`}
      className="group w-[76vw] max-w-[340px] flex-shrink-0 cursor-pointer select-none sm:w-[300px] lg:w-[340px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition-colors duration-500 group-hover:border-white/30">
        <OptimizedImage
          src={cert.image}
          alt=""
          className="h-full w-full object-cover object-top opacity-85 transition-[transform,opacity] duration-700 ease-expo group-hover:scale-[1.04] group-hover:opacity-100"
          containerClassName="h-full w-full"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold leading-snug text-white line-clamp-2 md:text-[17px]">{cert.title}</h3>
        <span className="pt-0.5 text-sm tabular-nums text-white/40">{cert.date}</span>
      </div>
      <p className="mt-1 text-sm text-white/50 line-clamp-1">{cert.issuer}</p>
    </article>
  );
};

export default Certifications;
