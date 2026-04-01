import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectModal from '../projects/ProjectModal';
import FeaturedCard from './FeaturedCard';

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.isFeatured);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const nextIndex = prev + newDirection;
      if (nextIndex < 0) return featuredProjects.length - 1;
      if (nextIndex >= featuredProjects.length) return 0;
      return nextIndex;
    });
  };

  const cardVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 45 : -45,
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      z: -200,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      z: 0,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -45 : 45,
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      z: -200,
    }),
  };

  return (
    <section className="relative bg-transparent py-10 sm:py-14 md:py-20 lg:py-28 2xl:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black tracking-tight text-white mb-2 uppercase">
                FEATURED WORK
              </h2>
              <p className="text-slate-500 text-base md:text-lg 2xl:text-xl font-light">
                My best projects
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(-1)}
                className="p-2.5 sm:p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="p-2.5 sm:p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="relative h-[420px] sm:h-[460px] md:h-[500px] lg:h-[520px]" style={{ perspective: '1200px' }}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0 flex justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-full max-w-[360px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]">
                <FeaturedCard
                  project={featuredProjects[currentIndex]}
                  index={currentIndex}
                  onClick={() => setSelectedProject(featuredProjects[currentIndex])}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -left-4 sm:left-0 top-1/2 -translate-y-1/2 w-16 sm:w-24 md:w-32 opacity-30 scale-90 blur-[1px] pointer-events-none hidden lg:block" style={{ transform: 'translateY(-50%) translateX(-20%) rotateY(25deg)', transformStyle: 'preserve-3d' }}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] aspect-[16/10]" />
          </div>
          <div className="absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 w-16 sm:w-24 md:w-32 opacity-30 scale-90 blur-[1px] pointer-events-none hidden lg:block" style={{ transform: 'translateY(-50%) translateX(20%) rotateY(-25deg)', transformStyle: 'preserve-3d' }}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] aspect-[16/10]" />
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 sm:mt-10 flex justify-center"
        >
          <button
            onClick={() => navigate('/projects')}
            className="group flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300"
          >
            <span className="text-sm sm:text-base font-medium text-white">
              View All Projects
            </span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default FeaturedProjects;
