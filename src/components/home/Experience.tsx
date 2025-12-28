import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const experiences = [
  {
    company: 'Ruang Media Solusi',
    role: 'Fullstack Developer Intern',
    period: 'Nov 2025 - Present',
    description:
      'Building modern web solutions with Vue.js and Tailwind CSS. Developing responsive school profile websites with engaging UI/UX designs, collaborating closely with the team on fullstack development tasks to deliver polished digital experiences.',
  },
  {
    company: 'Horus Technology',
    role: 'Fullstack Developer Intern',
    period: 'Oct 2025 - Nov 2025',
    description:
      'Contributed to the TING App using modern web technologies. Designed and developed compelling landing pages with pixel-perfect attention to detail, working across both frontend and backend to implement robust features.',
  },
  {
    company: 'Informatics Lab - UPN Veteran Yogyakarta',
    role: 'Laboratory Assistant',
    period: 'Aug 2022 - Jul 2025',
    description:
      'Mentored over 200 students across 8 different technical courses including Database Systems, IoT, and Web Development. Created comprehensive teaching materials and hands-on lab exercises that bridged theoretical knowledge with practical application.',
  },
  {
    company: 'IT Club - UPN Veteran Yogyakarta',
    role: 'Deputy Head of Web Development',
    period: 'Jul 2023 - Aug 2024',
    description:
      'Led training programs for React and Express.js, organized workshops and coding bootcamps for aspiring developers. Managed the web development team and coordinated projects that fostered a collaborative learning environment.',
  },
];

const Experience = () => {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0a0a] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* === LEFT COLUMN - STICKY TITLE === */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 h-fit">
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                Professional
                <br />
                Experience
              </h2>
            </div>
          </div>

          {/* === RIGHT COLUMN - CONTENT LIST === */}
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-16">
              {experiences.map((exp, index) => (
                <ExperienceItem
                  key={index}
                  experience={exp}
                  index={index}
                  isLast={index === experiences.length - 1}
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
    period: string;
    description: string;
  };
  index: number;
  isLast: boolean;
}

const ExperienceItem = ({ experience, index, isLast }: ExperienceItemProps) => {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`${!isLast ? 'pb-16 border-b border-white/10' : ''}`}
    >
      {/* === TOP ROW: COMPANY + YEAR === */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          {experience.company}
        </h3>
        <span className="text-sm md:text-base text-gray-500 font-mono whitespace-nowrap">
          {experience.period}
        </span>
      </div>

      {/* === ROLE TITLE === */}
      <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
        {experience.role}
      </p>

      {/* === DESCRIPTION === */}
      <p className="text-gray-400 text-base md:text-lg leading-relaxed">
        {experience.description}
      </p>
    </motion.div>
  );
};

export default Experience;
