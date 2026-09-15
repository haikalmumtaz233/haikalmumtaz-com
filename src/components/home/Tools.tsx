import { motion } from 'framer-motion';
import { tools } from '../../data/tools';
import TechIcon from '../ui/TechIcon';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps } from '../../lib/motion';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';

const Tools = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const toolsTrack = prefersReducedMotion ? tools : [...tools, ...tools];

  return (
    <section className="relative bg-transparent py-8 sm:py-12 md:py-16 2xl:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-8 sm:mb-10 2xl:mb-16">
          <RuleReveal
            lines={['Tools & Software']}
            align="center"
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black text-white uppercase tracking-tight mb-3"
          />
          <FadeIn>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl max-w-2xl mx-auto">
              My tools for development and design.
            </p>
          </FadeIn>
        </div>
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
