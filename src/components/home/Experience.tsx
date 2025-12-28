import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const experiences = [
  {
    company: 'Ruang Media Solusi',
    role: 'Fullstack Developer Intern',
    year: '2025',
    period: 'NOV — PRESENT',
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
    company: 'IT Club - UPN Veteran Yogyakarta',
    role: 'Deputy Head of Web Development',
    year: '2023',
    period: 'JUL — AUG 2024',
    description:
      'Led training programs for React and Express.js, organized workshops and coding bootcamps for aspiring developers. Managed the web development team and coordinated projects that fostered a collaborative learning environment.',
  },
  {
    company: 'Bangkit Academy 2023',
    subtitle: 'By Google, GoTo, & Traveloka',
    role: 'Machine Learning Cohort',
    year: '2023',
    period: 'AUG 23 — JAN 24',
    description:
      'Selected as a Machine Learning Cohort in a competitive program led by Google. Completed specialized curriculum in Python, Data Processing, and Model Deployment. Built a capstone project for IoT-based electricity forecasting using LSTM neural networks, achieving high-accuracy time-series predictions.',
  },
  {
    company: 'Informatics Lab - UPN Veteran Yogyakarta',
    role: 'Laboratory Assistant',
    year: '2022',
    period: 'AUG — JUL 2025',
    description:
      'Mentored over 200 students across 8 different technical courses including Database Systems, IoT, and Web Development. Created comprehensive teaching materials and hands-on lab exercises that bridged theoretical knowledge with practical application.',
  },
];

const Experience = () => {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] pt-40 pb-24 md:pt-52 md:pb-32 w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          {/* === LEFT COLUMN - STICKY TITLE === */}
          <div className="lg:col-span-4 min-h-full">
            <div className="sticky top-1/2 -translate-y-1/2 py-8 pr-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-5xl xl:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] w-full break-words">
                  Professional
                  <br />
                  Experience
                </h2>
              </motion.div>
            </div>
          </div>

          {/* === RIGHT COLUMN - CINEMATIC LIST === */}
          <div className="lg:col-span-8 relative">
            {/* === SCROLL PROGRESS LINE === */}
            {/* <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10 hidden lg:block" /> */}
            
            <div>
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
        {/* === INNER GRID: YEAR + CONTENT === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* === LEFT: YEAR/PERIOD === */}
          <div className="md:col-span-3">
            <div className="font-mono text-gray-500 text-sm md:text-base tracking-wider">
              <div className="text-white font-bold text-lg md:text-xl">{experience.year}</div>
              <div className="mt-1 text-xs md:text-sm">{experience.period}</div>
            </div>
          </div>

          {/* === RIGHT: COMPANY, ROLE, DESCRIPTION === */}
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
            <p className="text-xl md:text-2xl font-medium bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              {experience.role}
            </p>
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
