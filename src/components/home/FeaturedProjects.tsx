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

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === featuredProjects.length - 1;

  const paginate = (newDirection: number) => {
    if (newDirection < 0 && isFirstSlide) return;
    if (newDirection > 0 && isLastSlide) return;
    setDirection(newDirection);
    setCurrentIndex((prev) => prev + newDirection);
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
    <section id="projects" className="relative bg-transparent py-10 sm:py-14 md:py-20 lg:py-28 2xl:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="mb-2 sm:mb-3 md:mb-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-monument font-black tracking-tight text-white mb-1 sm:mb-2 uppercase">
                FEATURED WORK
              </h2>
              <p className="text-slate-500 text-sm sm:text-base md:text-lg 2xl:text-xl font-light">
                My best projects
              </p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all duration-300"
            >
              <span className="text-[11px] sm:text-xs md:text-sm font-medium text-white">
                View All
              </span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <button
            onClick={() => paginate(-1)}
            disabled={isFirstSlide}
            className={`flex-shrink-0 p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full border transition-all duration-300 ${
              isFirstSlide
                ? 'bg-white/[0.02] border-white/5 cursor-not-allowed'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <ChevronLeft className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isFirstSlide ? 'text-white/20' : 'text-white'}`} />
          </button>

          <div className="flex-1 relative h-[280px] md:h-[240px] lg:h-[280px] xl:h-[320px] 2xl:h-[360px]" style={{ perspective: '1200px' }}>
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
                className="absolute inset-0 flex justify-center items-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-full max-w-[260px] md:max-w-[580px] lg:max-w-[700px] xl:max-w-[800px] 2xl:max-w-[900px]">
                  <FeaturedCard
                    project={featuredProjects[currentIndex]}
                    index={currentIndex}
                    onClick={() => setSelectedProject(featuredProjects[currentIndex])}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => paginate(1)}
            disabled={isLastSlide}
            className={`flex-shrink-0 p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full border transition-all duration-300 ${
              isLastSlide
                ? 'bg-white/[0.02] border-white/5 cursor-not-allowed'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isLastSlide ? 'text-white/20' : 'text-white'}`} />
          </button>
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 md:mt-4">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-5 sm:w-6' : 'w-1.5 sm:w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default FeaturedProjects;
