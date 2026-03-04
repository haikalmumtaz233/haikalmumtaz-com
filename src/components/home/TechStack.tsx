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
    <section className="relative bg-transparent py-10 sm:py-12 md:py-16 2xl:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-8 sm:mb-10 2xl:mb-16"
        >
          <div className="overflow-hidden">
            <motion.h2
              variants={wordVariants}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black text-white uppercase tracking-tight mb-3"
            >
              Tech Stack
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl max-w-2xl mx-auto"
            >
              Technologies I use to develop, build, and deploy.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 2xl:gap-6"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3 p-3 2xl:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 2xl:w-14 2xl:h-14 rounded-lg bg-black/50 flex items-center justify-center p-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative">
                <span className="text-slate-400 font-semibold text-xs md:text-sm lg:text-base 2xl:text-lg transition-colors duration-300 group-hover:text-white block">
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
