import { motion } from 'framer-motion';
import { techCategories } from '../../data/techStack';
import TechIcon from '../ui/TechIcon';
import RuleReveal from '../../journey/RuleReveal';
import FadeIn from '../../journey/FadeIn';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const TechStack = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative bg-transparent py-10 sm:py-12 md:py-16 2xl:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center mb-8 sm:mb-10 2xl:mb-16">
          <RuleReveal
            lines={['Tech Stack']}
            align="center"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black text-white uppercase tracking-tight mb-3"
          />
          <FadeIn>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg 2xl:text-xl max-w-2xl mx-auto">
              Technologies I use to develop, build, and deploy.
            </p>
          </FadeIn>
        </div>

        <div className="border-b border-white/10">
          {techCategories.map((category) => (
            <motion.div
              key={category.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-6 md:py-8 2xl:py-10"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/10"
                variants={{
                  hidden: { scaleX: prefersReducedMotion ? 1 : 0 },
                  visible: { scaleX: 1, transition: { duration: 1.2, ease: easing.wipe } },
                }}
              />

              <motion.div
                className="flex items-baseline gap-3 md:flex-col md:gap-2"
                variants={{
                  hidden: prefersReducedMotion ? {} : { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easing.expo, delay: 0.2 } },
                }}
              >
                <h3 className="font-mono text-xs md:text-sm 2xl:text-base font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {category.title}
                </h3>
                <span className="font-mono text-xs 2xl:text-sm text-slate-400">
                  {String(category.items.length).padStart(2, '0')}
                </span>
              </motion.div>

              <motion.div
                className="flex flex-wrap content-start gap-2 sm:gap-3 2xl:gap-4"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.3 } },
                }}
              >
                {category.items.map((tech) => (
                  <motion.div
                    key={tech.name}
                    variants={{
                      hidden: prefersReducedMotion ? {} : { opacity: 0, y: 14, scale: 0.96 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: easing.expo } },
                    }}
                    className="group flex items-center gap-2.5 px-3 py-2 2xl:px-4 2xl:py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-colors duration-300 cursor-pointer"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 2xl:w-7 2xl:h-7 flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-expo group-hover:scale-110 group-hover:-rotate-6">
                      <TechIcon icon={tech.icon} name={tech.name} />
                    </div>
                    <span className="text-slate-400 font-semibold text-xs md:text-sm 2xl:text-base whitespace-nowrap transition-colors duration-300 group-hover:text-white">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
