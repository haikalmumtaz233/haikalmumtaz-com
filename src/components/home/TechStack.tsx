import { motion } from 'framer-motion';
import { techCategories } from '../../data/techStack';
import TechIcon from '../ui/TechIcon';
import SectionHeader from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const technologyCount = techCategories.reduce((total, category) => total + category.items.length, 0);

const TechStack = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative pt-24 md:pt-32 2xl:pt-40 pb-16 md:pb-20">
      <div className="shell">
        <SectionHeader
          title={['Tech stack']}
          meta={
            <p className="text-sm md:text-base text-white/55">
              {technologyCount} technologies in {techCategories.length} areas
            </p>
          }
        />

        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14 2xl:gap-y-16">
          {techCategories.map((category) => (
            <motion.div
              key={category.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="relative pt-5"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-white/15"
                variants={{
                  hidden: { scaleX: prefersReducedMotion ? 1 : 0 },
                  visible: { scaleX: 1, transition: { duration: 1.2, ease: easing.wipe } },
                }}
              />

              <motion.div
                className="mb-5 flex items-baseline justify-between gap-4"
                variants={{
                  hidden: prefersReducedMotion ? {} : { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: easing.expo, delay: 0.2 } },
                }}
              >
                <h3 className="text-base font-semibold text-white md:text-lg">{category.title}</h3>
                <span className="text-sm tabular-nums text-white/40">{category.items.length}</span>
              </motion.div>

              <motion.ul
                className="grid grid-cols-2 gap-x-4 gap-y-3.5"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.3 } },
                }}
              >
                {category.items.map((tech) => (
                  <motion.li
                    key={tech.name}
                    variants={{
                      hidden: prefersReducedMotion ? {} : { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easing.expo } },
                    }}
                    className="group flex min-w-0 items-center gap-3"
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center transition-transform duration-500 ease-expo group-hover:scale-110 group-hover:-rotate-6 2xl:h-6 2xl:w-6">
                      <TechIcon icon={tech.icon} name={tech.name} />
                    </span>
                    <span className="truncate text-[15px] text-white/70 transition-colors duration-300 group-hover:text-white 2xl:text-base">
                      {tech.name}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
