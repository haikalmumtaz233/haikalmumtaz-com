import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectModal from '../projects/ProjectModal';
import FeaturedCard from './FeaturedCard';

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.isFeatured);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [60, 0]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={containerRef} className="relative bg-transparent py-10 sm:py-14 md:py-20 lg:py-28 2xl:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ opacity, y }}
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
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        ref={carouselRef}
        className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        drag="x"
        dragConstraints={carouselRef}
        dragElastic={0.1}
        dragMomentum={true}
        _dragX={dragX}
      >
        <div className="flex-shrink-0 w-[calc((100vw-2rem-16px)/1.2)] sm:w-[calc((100vw-3rem-20px)/2)] lg:w-[calc((100vw-4rem-48px)/3)] xl:w-[calc((100vw-4rem-48px)/3.5)] 2xl:w-[400px] first:ml-[calc((100vw-min(100vw-2rem,1280px))/2)]" />
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 w-[calc((100vw-2rem-16px)/1.2)] sm:w-[calc((100vw-3rem-20px)/2)] lg:w-[calc((100vw-4rem-48px)/3)] xl:w-[calc((100vw-4rem-48px)/3.5)] 2xl:w-[400px] snap-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: index * 0.1,
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <FeaturedCard
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex sm:hidden justify-center gap-2 mt-4">
          {featuredProjects.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-white/20"
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
