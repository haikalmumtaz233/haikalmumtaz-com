import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.isFeatured);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  return (
    <section className="relative bg-transparent py-10 sm:py-14 md:py-20 lg:py-28 2xl:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="mb-8 sm:mb-12 md:mb-16 2xl:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black tracking-tight text-white mb-3 uppercase">
            FEATURED WORK
          </h2>
          <p className="text-slate-500 text-base md:text-lg 2xl:text-xl font-light">
            My best projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 sm:mt-14 flex justify-center"
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
