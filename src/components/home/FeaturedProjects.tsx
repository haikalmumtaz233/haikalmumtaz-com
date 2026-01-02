import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { projects, type Project } from '../../data/projects';

const FeaturedProjects = () => {
  return (
    <section className="relative bg-transparent py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-monument font-black tracking-tight text-white mb-4 uppercase">
            FEATURED WORK
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light">
            My best projects
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-32">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const isRepoDisabled = !project.repoLink || project.repoLink === '#';
  const isLiveDisabled = !project.liveLink || project.liveLink === '#';
  const isEven = index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        isEven ? '' : 'lg:flex-row-reverse'
      }`}
    >
      {/* === IMAGE CONTAINER === */}
      <div
        className={`relative ${
          isEven ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl group">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-30 pointer-events-none`} />
          
          <img
            src={project.image}
            alt={`${project.name} - ${project.subtitle}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-md text-gray-300 text-xs font-mono rounded-full tracking-wider uppercase border border-white/20">
            {project.category}
          </div>

          <div className="absolute bottom-4 right-4 text-7xl md:text-8xl font-black text-white/5 pointer-events-none select-none">
            0{index + 1}
          </div>
        </div>
      </div>

      {/* === CONTENT CONTAINER === */}
      <div
        className={`flex flex-col justify-center space-y-6 ${
          isEven ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter leading-tight">
            {project.name}
          </h3>
          <p className="text-xl md:text-2xl text-gray-400 font-light">
            {project.subtitle}
          </p>
        </div>

        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {isRepoDisabled ? (
            <span className="flex items-center justify-center gap-2 font-semibold text-sm md:text-base px-6 py-3 rounded-xl border border-white/5 bg-white/5 text-gray-600 cursor-not-allowed opacity-50">
              <Github size={20} /> Repository
            </span>
          ) : (
            <motion.a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 font-semibold text-sm md:text-base px-6 py-3 rounded-xl border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              <Github size={20} /> Repository
            </motion.a>
          )}

          {isLiveDisabled ? (
            <span className="flex items-center justify-center gap-2 font-semibold text-sm md:text-base px-6 py-3 rounded-xl bg-gray-800 text-gray-500 cursor-not-allowed opacity-50">
              <ExternalLink size={20} /> Live Demo
            </span>
          ) : (
            <motion.a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 font-semibold text-sm md:text-base px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-colors"
            >
              <ExternalLink size={20} /> Live Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProjects;