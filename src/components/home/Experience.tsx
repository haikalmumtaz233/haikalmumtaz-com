import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { experiences } from '../../data/experience'; // Import Data

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
    <section ref={sectionRef} className="relative bg-transparent pt-20 md:pt-40 pb-10 w-full overflow-x-clip">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-stretch">
          {/* === LEFT COLUMN - STICKY TITLE === */}
          <div className="lg:col-span-5 min-h-full">
            <div className="sticky top-1/2 -translate-y-1/2 py-8 text-left border-l-2 border-white/20 pl-8 md:pl-12">
              <motion.div
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-monument font-black text-white uppercase tracking-tight leading-none">
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

          {/* === RIGHT COLUMN - CINEMATIC LIST === */}
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
    <div className="min-h-[80vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        className="border-t border-white/20 pt-16 pb-16 lg:pl-12 transition-opacity duration-500 ease-in-out cursor-pointer"
        style={{
          opacity: isDimmed ? 0.2 : 1,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          <div className="md:col-span-3">
            <div className="font-mono text-gray-500 text-sm md:text-base tracking-wider">
              <div className="text-white font-bold text-lg md:text-xl">{experience.year}</div>
              <div className="mt-1 text-xs md:text-sm">{experience.period}</div>
            </div>
          </div>

          <div className="md:col-span-9">
            <div className="space-y-1 mb-4">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                {experience.company}
              </h3>
              {experience.subtitle && (
                <p className="text-sm md:text-base text-gray-500 font-medium">
                  {experience.subtitle}
                </p>
              )}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6 transition-all duration-300">
              <p className="text-sm md:text-base font-medium text-white tracking-wider">
                {experience.role}
              </p>
            </div>
            <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl">
              {experience.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Experience;