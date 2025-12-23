import { motion } from 'framer-motion';

const TechStack = () => {
  const skills = [
    'Java',
    'JavaScript',
    'Python',
    'PHP',
    'SQL',
    'React',
    'Vue',
    'Tailwind CSS',
    'Express',
    'Git',
    'TensorFlow',
  ];

  const duplicatedSkills = [...skills, ...skills];

  return (
    <section className="relative bg-gray-900 py-8 md:py-12 overflow-hidden">
      {/* === FADE OVERLAY LEFT === */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>

      {/* === FADE OVERLAY RIGHT === */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>

      {/* === SCROLLING MARQUEE === */}
      <div className="flex">
        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-8 pr-8"
        >
          {duplicatedSkills.map((skill, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
            >
              <span className="text-white/80 font-medium text-base md:text-lg whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          animate={{
            x: [0, -1000],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-8 pr-8"
        >
          {duplicatedSkills.map((skill, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex-shrink-0 px-4 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
            >
              <span className="text-white/80 font-medium text-base md:text-lg whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
