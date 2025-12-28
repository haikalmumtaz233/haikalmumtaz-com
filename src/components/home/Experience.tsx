import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const experiences = [
  {
    company: 'Ruang Media Solusi',
    role: 'Fullstack Developer Intern',
    year: '2025',
    period: 'PRESENT',
    description:
      'Building modern web solutions with Vue.js and Tailwind CSS. Developing responsive school profile websites with engaging UI/UX designs, collaborating closely with the team on fullstack development tasks to deliver polished digital experiences.',
  },
  {
    company: 'Horus Technology',
    role: 'Fullstack Developer Intern',
    year: '2025',
    period: 'OCT — NOV',
    description:
      'Contributed to the TING App using modern web technologies. Designed and developed compelling landing pages with pixel-perfect attention to detail, working across both frontend and backend to implement robust features.',
  },
  {
    company: 'Informatics Lab - UPN Veteran Yogyakarta',
    role: 'Laboratory Assistant',
    year: '2022',
    period: 'AUG — JUL 2025',
    description:
      'Mentored over 200 students across 8 different technical courses including Database Systems, IoT, and Web Development. Created comprehensive teaching materials and hands-on lab exercises that bridged theoretical knowledge with practical application.',
  },
  {
    company: 'IT Club - UPN Veteran Yogyakarta',
    role: 'Deputy Head of Web Development',
    year: '2023',
    period: 'JUL — AUG 2024',
    description:
      'Led training programs for React and Express.js, organized workshops and coding bootcamps for aspiring developers. Managed the web development team and coordinated projects that fostered a collaborative learning environment.',
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* === LEFT COLUMN - STICKY TITLE === */}
          <div className="lg:col-span-4">
            <div className="sticky top-0 h-screen flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"
                />
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                Career
                <br />
                History
              </h2>
            </div>
          </div>

          {/* === RIGHT COLUMN - CONTENT LIST === */}
          <div className="lg:col-span-8">
            <div className="flex flex-col">
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
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="border-t border-white/20 pt-12 pb-12 transition-all duration-500 cursor-pointer"
      style={{
        opacity: isDimmed ? 0.3 : 1,
        transform: isDimmed ? 'scale(0.98)' : isHovered ? 'translateX(10px)' : 'none',
      }}
    >
      {/* === INNER GRID: YEAR + CONTENT === */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* === LEFT: YEAR/PERIOD === */}
        <div className="md:col-span-3">
          <div className="font-mono text-gray-500 text-sm md:text-base tracking-wider">
            <div className="text-white font-bold text-lg">{experience.year}</div>
            <div className="mt-1">{experience.period}</div>
          </div>
        </div>

        {/* === RIGHT: COMPANY, ROLE, DESCRIPTION === */}
        <div className="md:col-span-9">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 transition-colors duration-300">
            {experience.company}
          </h3>
          <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            {experience.role}
          </p>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            {experience.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;
