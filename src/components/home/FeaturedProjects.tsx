import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import CategoryFilter from './CategoryFilter';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const FeaturedProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category))];
    return ['All', ...unique];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

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
          <p className="text-slate-500 text-base md:text-lg 2xl:text-xl font-light mb-8 sm:mb-10">
            My best projects
          </p>
<CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </motion.div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
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
