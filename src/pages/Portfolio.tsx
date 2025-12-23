import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { projects } from '../data/projects';
import ProjectCard from '../components/portfolio/ProjectCard';

type CategoryType = 'All' | 'Web Dev' | 'Data Science' | 'Mobile & Game';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All');

  const categories: CategoryType[] = ['All', 'Web Dev', 'Data Science', 'Mobile & Game'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section className="relative min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      {/* === ENGINEERING GRID BACKGROUND === */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Featured Projects
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A collection of my work spanning web development, data science, and game development. Each project represents a unique challenge and solution.
          </p>
        </motion.div>

        {/* === FLOATING FILTER DOCK === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-7xl mx-auto mb-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-1 p-2 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-full shadow-xl shadow-black/10">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 overflow-hidden ${
                  activeCategory === category
                    ? 'text-white shadow-lg shadow-cyan-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="filterHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* === PROJECTS GRID === */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
