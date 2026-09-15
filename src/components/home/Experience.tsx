import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { experiences, type Experience as ExperienceEntry } from '../../data/experience';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';
import SectionHeader from '../ui/SectionHeader';

const firstYear = experiences[experiences.length - 1]?.period.match(/\d{4}/)?.[0];

const Experience = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.7', 'end 0.5'],
  });
  const spine = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section className="relative section-space overflow-x-clip">
      <div className="shell">
        <SectionHeader
          title={['Experience']}
          meta={
            <p className="text-sm md:text-base text-white/55">
              {experiences.length} roles since {firstYear}
            </p>
          }
        />

        <ol ref={listRef} className="relative border-b border-white/10">
          <span aria-hidden="true" className="absolute left-[3px] top-0 bottom-0 w-px bg-white/10" />
          {!prefersReducedMotion && (
            <motion.span
              aria-hidden="true"
              className="absolute left-[3px] top-0 bottom-0 w-px origin-top bg-white/70"
              style={{ scaleY: spine }}
            />
          )}
          {experiences.map((entry, index) => (
            <ExperienceItem
              key={entry.company}
              entry={entry}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

interface ExperienceItemProps {
  entry: ExperienceEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const ExperienceItem = ({ entry, index, isOpen, onToggle }: ExperienceItemProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelId = `experience-panel-${index}`;
  const isCurrent = entry.period.includes('Present');

  return (
    <motion.li
      className="relative pl-8 md:pl-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-white/10"
        variants={{
          hidden: { scaleX: prefersReducedMotion ? 1 : 0 },
          visible: { scaleX: 1, transition: { duration: 1.1, ease: easing.wipe } },
        }}
      />
      <span
        aria-hidden="true"
        className={`absolute left-0 top-[1.9rem] md:top-[2.35rem] h-[7px] w-[7px] rounded-full transition-colors duration-500 ${
          isOpen ? 'bg-white' : 'bg-white/30'
        }`}
      />

      <motion.div
        variants={{
          hidden: prefersReducedMotion ? {} : { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 1, ease: easing.expo, delay: 0.15 } },
        }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-1 py-6 text-left md:grid-cols-12 md:py-8"
        >
          <span className="col-span-1 text-sm tabular-nums text-white/50 md:col-span-3 md:pt-2 md:text-base">
            {entry.period}
          </span>
          <span className="col-start-1 row-start-2 md:col-span-8 md:col-start-4 md:row-start-1">
            <span className="block text-xl font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-white/80 md:text-2xl 2xl:text-3xl">
              {entry.company}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-white/60 md:text-base">
              {entry.role}
              {isCurrent && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-300/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Current
                </span>
              )}
            </span>
          </span>
          <span className="col-start-2 row-span-2 row-start-1 flex h-9 w-9 items-center justify-center self-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-white/40 md:col-span-1 md:col-start-12 md:justify-self-end">
            <Plus
              className={`h-4 w-4 text-white transition-transform duration-500 ease-expo ${isOpen ? 'rotate-45' : ''}`}
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              className="overflow-hidden"
              initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: easing.expo }}
            >
              <div className="pb-8 md:grid md:grid-cols-12 md:gap-x-6 md:pb-10">
                <div className="md:col-span-7 md:col-start-4">
                  {entry.subtitle && <p className="mb-2 text-sm text-white/45">{entry.subtitle}</p>}
                  <p className="max-w-[62ch] text-[15px] leading-relaxed text-white/65 md:text-base 2xl:text-lg">
                    {entry.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
};

export default Experience;
