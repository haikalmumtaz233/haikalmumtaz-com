import { motion } from 'framer-motion';
import { tools } from '../../data/tools';

const Tools = () => {
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
  }

  const toolsTrack = [...tools, ...tools];

  return (
    <section className="relative bg-transparent py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-10"
        >
          <div className="overflow-hidden">
            <motion.h2
              variants={wordVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-monument font-black text-white uppercase tracking-tight mb-3"
            >
              Tools & Software
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto"
            >
              My tools for development and design.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="w-full overflow-hidden relative flex">

        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-4 pr-4 flex-shrink-0"
        >
          {toolsTrack.map((tool, index) => (
            <div
              key={`t1-${index}`}
              className="w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-xs md:text-sm font-mono text-slate-400 group-hover:text-white transition-colors duration-300 text-center px-2">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex gap-4 pr-4 flex-shrink-0"
        >
          {toolsTrack.map((tool, index) => (
            <div
              key={`t2-${index}`}
              className="w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-xs md:text-sm font-mono text-slate-400 group-hover:text-white transition-colors duration-300 text-center px-2">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Tools;
