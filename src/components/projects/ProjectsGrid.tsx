import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, easing } from '../../lib/motion';

const ProjectsGrid = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category))];
    return ['All', ...unique];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  useEffect(() => {
    const updateWidth = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      if (filterRef.current && containerRef.current && mobile) {
        const scrollWidth = filterRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setDragWidth(Math.max(0, scrollWidth - containerWidth + 32));
      } else {
        setDragWidth(0);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [categories]);

  return (
    <section className="relative pb-24 md:pb-32 2xl:pb-40">
      <div className="shell">
        <motion.div
          {...animatedProps(prefersReducedMotion, {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.55, duration: 0.9, ease: easing.expo },
          })}
          className="mb-10 md:mb-12"
        >
          <div ref={containerRef} className="overflow-hidden sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
            <motion.div 
              ref={filterRef}
              className={`flex gap-2 sm:gap-3 sm:flex-wrap pr-4 sm:pr-0 ${isMobile && dragWidth > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
              drag={isMobile && dragWidth > 0 ? "x" : false}
              dragConstraints={{ right: 0, left: -dragWidth }}
              style={{ touchAction: 'pan-y' }}
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                const count = category === 'All' 
                  ? projects.length 
                  : projects.filter(p => p.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-white/55 hover:text-white/80'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="projectsActiveFilter"
                        className="absolute inset-0 bg-white/10 border border-white/20 rounded-full"
                        transition={{ duration: 0.6, ease: easing.expo }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                      {category}
                      <span className={`text-xs tabular-nums px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20' : 'bg-white/5'
                      }`}>
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 2xl:gap-x-8 2xl:gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: easing.exit } }
                }
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: easing.expo,
                  delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.05,
                  layout: { duration: 0.7, ease: easing.expo },
                }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/55 text-lg">No projects in this category yet.</p>
          </motion.div>
        )}

        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default ProjectsGrid;
