import { motion } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '../../data/experience';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { maskedWordVariants, staggerContainerVariants } from '../../lib/motion';
import { Ledger, LedgerRow } from '../ui/Ledger';

const Experience = () => {
  const sectionRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const titleVariants = staggerContainerVariants(prefersReducedMotion, 0.15);
  const wordVariants = maskedWordVariants(prefersReducedMotion);

  return (
    <section ref={sectionRef} className="relative bg-transparent pt-10 sm:pt-16 md:pt-24 2xl:pt-32 pb-8 w-full overflow-x-clip">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 py-4 text-left border-l-2 border-white/20 pl-6 md:pl-8">
              <motion.div
                variants={titleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-monument font-black text-white uppercase tracking-tight leading-none">
                  <div className="overflow-hidden">
                    <motion.span variants={wordVariants} className="inline-block mr-3">
                      Professional
                    </motion.span>
                    <motion.span variants={wordVariants} className="inline-block ">
                      Experience
                    </motion.span>
                  </div>
                </h2>

                <p className="mt-4 font-mono text-[11px] tabular-nums tracking-[0.2em] text-slate-400 uppercase">
                  {experiences[experiences.length - 1].year}—{experiences[0].year} · {experiences.length} roles
                </p>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Ledger label="Professional experience">
              {experiences.map((experience) => (
                <LedgerRow
                  key={`${experience.company}-${experience.year}`}
                  marker={experience.year}
                  title={experience.company}
                  subtitle={experience.role}
                  meta={experience.period}
                >
                  {experience.subtitle && (
                    <span className="block mb-1 font-medium text-slate-300">{experience.subtitle}</span>
                  )}
                  {experience.description}
                </LedgerRow>
              ))}
            </Ledger>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
