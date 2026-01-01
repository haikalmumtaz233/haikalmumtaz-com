import { motion } from 'framer-motion';
import { techStack } from '../../data/techStack';

const TechStack = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="relative bg-transparent py-13 md:py-21">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* === HEADER === */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <div className="overflow-hidden">
            <motion.h2
              variants={wordVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-monument font-black text-white uppercase tracking-tight mb-4"
            >
              Tech Stack
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Technologies I use to develop, build, and deploy.
            </motion.p>
          </div>
        </motion.div>

        {/* === TECH GRID === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
            >
              {/* === ICON WRAPPER === */}
              <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center p-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative">
                <span className="text-gray-400 font-semibold text-base md:text-lg transition-colors duration-300 group-hover:text-white block">
                  {tech.name}
                </span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:w-full opacity-0 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;