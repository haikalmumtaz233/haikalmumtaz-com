import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { experiences } from '../../data/experience';

const Experience = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <section ref={sectionRef} className="relative bg-transparent pt-10 sm:pt-16 md:pt-24 2xl:pt-32 pb-8 w-full overflow-x-clip">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 min-h-full">
            <div className="sticky top-1/2 -translate-y-1/2 py-8 text-left border-l-2 border-white/20 pl-8 md:pl-12">
              <motion.div
                variants={titleVariants}
                initial="hidden"
                animate="visible"
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
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="max-w-3xl">
              {experiences.map((exp, index) => (
                <ExperienceItem
                  key={index}
                  experience={exp}
                  index={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface ExperienceItemProps {
  experience: {
    company: string;
    subtitle?: string;
    role: string;
    year: string;
    period: string;
    description: string;
  };
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

const ExperienceItem = ({ experience, index, hoveredIndex, setHoveredIndex }: ExperienceItemProps) => {
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <div className="min-h-0 sm:min-h-[40vh] lg:min-h-[60vh] 2xl:min-h-[70vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        className="border-t border-white/20 pt-6 pb-6 sm:pt-8 sm:pb-8 lg:pt-10 lg:pb-10 lg:pl-12 transition-opacity duration-500 ease-in-out"
        style={{
          opacity: isDimmed ? 0.2 : 1,
        }}
      >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          <div className="md:col-span-3">
            <div className="font-mono text-slate-500 text-sm tracking-wider">
              <div className="text-white font-bold text-base md:text-lg 2xl:text-xl">{experience.year}</div>
              <div className="mt-1 text-xs md:text-sm">{experience.period}</div>
            </div>
          </div>

          <div className="md:col-span-9">
            <div className="space-y-1 mb-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold text-white">
                {experience.company}
              </h3>
              {experience.subtitle && (
                <p className="text-sm md:text-base text-slate-500 font-medium">
                  {experience.subtitle}
                </p>
              )}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-4 transition-all duration-300">
              <p className="text-xs md:text-sm font-medium text-white tracking-wider">
                {experience.role}
              </p>
            </div>
            <p className="text-slate-400 text-sm md:text-base lg:text-lg 2xl:text-xl leading-relaxed max-w-3xl">
              {experience.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Experience;
