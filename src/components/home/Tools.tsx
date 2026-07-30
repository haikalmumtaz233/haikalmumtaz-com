import { motion } from 'framer-motion';
import { tools } from '../../data/tools';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, maskedWordVariants, staggerContainerVariants } from '../../lib/motion';

const Tools = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const titleVariants = staggerContainerVariants(prefersReducedMotion);
  const wordVariants = maskedWordVariants(prefersReducedMotion);

  const toolsTrack = prefersReducedMotion ? tools : [...tools, ...tools];

  return (
    <section className="relative bg-transparent py-8 sm:py-12 md:py-16 2xl:py-20 overflow-hidden">
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
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-display font-black text-white uppercase tracking-tight mb-3"
            >
              Tools & Software
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl max-w-2xl mx-auto"
            >
              My tools for development and design.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <div className="w-full overflow-hidden relative flex">
        <motion.div
          {...animatedProps(prefersReducedMotion, {
            animate: { x: ['0%', '-50%'] },
            transition: {
              duration: 40,
              repeat: Infinity,
              ease: 'linear' as const,
            },
          })}
          className={prefersReducedMotion ? 'flex flex-wrap justify-center' : 'flex flex-shrink-0'}
        >
          {toolsTrack.map((tool, index) => (
            <div
              key={`${tool.name}-${index}`}
              className="w-28 h-28 md:w-32 md:h-32 2xl:w-36 2xl:h-36 mr-4 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 2xl:w-12 2xl:h-12 flex items-center justify-center">
                <TechIcon
                  icon={tool.icon}
                  name={tool.name}
                  className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-xs md:text-sm 2xl:text-base font-mono text-slate-400 group-hover:text-white transition-colors duration-300 text-center px-2">
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
