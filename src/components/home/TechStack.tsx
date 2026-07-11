import { motion } from 'framer-motion';
import { techCategories } from '../../data/techStack';

const TechStack = () => {
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

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
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

        <div>
          {techCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={categoryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-6 md:py-8 2xl:py-10 border-t border-white/10 last:border-b"
            >
              <div className="flex items-baseline gap-3 md:flex-col md:gap-2">
                <h3 className="font-mono text-xs md:text-sm 2xl:text-base font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {category.title}
                </h3>
                <span className="font-mono text-xs 2xl:text-sm text-slate-600">
                  {String(category.items.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-wrap content-start gap-2 sm:gap-3 2xl:gap-4">
                {category.items.map((tech) => (
                  <motion.div
                    key={tech.name}
                    variants={chipVariants}
                    className="group flex items-center gap-2.5 px-3 py-2 2xl:px-4 2xl:py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 2xl:w-7 2xl:h-7 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={tech.logo}
                        alt={tech.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-slate-400 font-semibold text-xs md:text-sm 2xl:text-base whitespace-nowrap transition-colors duration-300 group-hover:text-white">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
