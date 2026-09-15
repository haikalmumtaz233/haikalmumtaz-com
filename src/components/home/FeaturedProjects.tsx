import { useState, useMemo, useCallback, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectModal from '../projects/ProjectModal';
import FeaturedCard from './FeaturedCard';
import SectionHeader from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

const VISIBLE_STACK = 4;
const SWIPE_THRESHOLD = 60;

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const featuredProjects = useMemo(() => projects.filter((p) => p.isFeatured), []);
  const activeProject = featuredProjects[currentIndex];

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        featuredProjects.forEach((project) => {
          const image = new Image();
          image.decoding = 'async';
          image.src = project.image;
        });
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [featuredProjects]);

  const select = (index: number) => {
    if (index === currentIndex || index < 0 || index >= featuredProjects.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleTabKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const keyMap: Record<string, number> = {
      ArrowDown: currentIndex + 1,
      ArrowRight: currentIndex + 1,
      ArrowUp: currentIndex - 1,
      ArrowLeft: currentIndex - 1,
      Home: 0,
      End: featuredProjects.length - 1,
    };
    const next = keyMap[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const clamped = Math.min(featuredProjects.length - 1, Math.max(0, next));
    select(clamped);
    tabRefs.current[clamped]?.focus();
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) select(currentIndex + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) select(currentIndex - 1);
  };

  const previewVariants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({
          clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
          x: dir > 0 ? 90 : -90,
          opacity: 1,
          scale: 1,
          zIndex: 2,
        }),
        center: {
          clipPath: 'inset(0% 0% 0% 0%)',
          x: 0,
          opacity: 1,
          scale: 1,
          zIndex: 2,
          transition: {
            clipPath: { duration: 1.05, ease: easing.expo },
            x: { duration: 1.2, ease: easing.expo },
          },
        },
        exit: (dir: number) => ({
          clipPath: 'inset(0% 0% 0% 0%)',
          x: dir > 0 ? -140 : 140,
          opacity: 0,
          scale: 0.92,
          zIndex: 1,
          transition: {
            default: { duration: 0.9, ease: easing.inout },
            opacity: { duration: 0.6, ease: easing.exit, delay: 0.15 },
          },
        }),
      };

  return (
    <section ref={sectionRef} className="relative section-space overflow-x-clip">
      <div className="shell">
        <SectionHeader
          title={['Featured work']}
          meta={
            <button
              type="button"
              onClick={() => navigate('/projects', { viewTransition: true })}
              className="group inline-flex items-center gap-2 border-b border-white/25 pb-1 text-sm md:text-base font-medium text-white transition-colors duration-300 hover:border-white"
            >
              Browse all {projects.length} projects
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          }
        />

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 lg:order-2">
            <div
              id="featured-preview"
              role="tabpanel"
              aria-labelledby={`featured-tab-${currentIndex}`}
              className="relative aspect-[16/10]"
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={previewVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={prefersReducedMotion ? { duration: 0.2 } : undefined}
                  className="absolute inset-0"
                  drag={prefersReducedMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={handleDragEnd}
                  style={{ touchAction: 'pan-y' }}
                >
                  <FeaturedCard project={activeProject} onClick={() => setSelectedProject(activeProject)} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-start justify-between gap-6">
              <ul className="flex flex-wrap gap-2" aria-label={`${activeProject.name} stack`}>
                {activeProject.stack.slice(0, VISIBLE_STACK).map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-white/10 px-3 py-1 text-[13px] text-white/70"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <span className="shrink-0 pt-1 text-sm tabular-nums text-white/45">
                {currentIndex + 1} / {featuredProjects.length}
              </span>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Featured projects"
            aria-orientation="vertical"
            onKeyDown={handleTabKeyDown}
            className="border-b border-white/10 lg:col-span-5 lg:order-1"
          >
            {featuredProjects.map((project, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={project.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`featured-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="featured-preview"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => select(index)}
                  className="group relative block w-full border-t border-white/10 py-5 text-left md:py-6"
                >
                  {isActive && (
                    <motion.span
                      layoutId={prefersReducedMotion ? undefined : 'featured-active-rule'}
                      aria-hidden="true"
                      className="absolute -top-px left-0 h-px w-full bg-white"
                      transition={{ duration: 0.8, ease: easing.expo }}
                    />
                  )}
                  <span
                    className={`block font-monument text-lg font-black uppercase leading-tight tracking-tight transition-colors duration-500 sm:text-xl md:text-2xl ${
                      isActive ? 'text-white' : 'text-white/35 group-hover:text-white/70'
                    }`}
                  >
                    {project.name}
                  </span>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        className="block overflow-hidden"
                        initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: easing.expo }}
                      >
                        <span className="block pt-3 text-[15px] text-white/65 md:text-base">{project.subtitle}</span>
                        <span className="mt-1 block text-sm text-white/40">{project.category}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      </div>
    </section>
  );
};

export default FeaturedProjects;
