import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { projects, type Project } from '../../data/projects';

const FeaturedProjects = () => {
  return (
    <section className="relative bg-transparent py-10 sm:py-14 md:py-20 lg:py-28 2xl:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16 2xl:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-monument font-black tracking-tight text-white mb-3 uppercase">
            FEATURED WORK
          </h2>
          <p className="text-slate-500 text-base md:text-lg 2xl:text-xl font-light">
            My best projects
          </p>
        </motion.div>

        <div className="space-y-10 sm:space-y-16 md:space-y-24 2xl:space-y-32">
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
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 2xl:gap-14 items-center ${
        isEven ? '' : 'lg:flex-row-reverse'
      }`}
    >
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

          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-md text-slate-300 text-xs font-mono rounded-full tracking-wider uppercase border border-white/20">
            {project.category}
          </div>

          <div className="absolute bottom-3 right-3 text-6xl md:text-7xl font-black text-white/5 pointer-events-none select-none">
            0{index + 1}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col justify-center space-y-4 ${
          isEven ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-black text-white mb-2 tracking-tighter leading-tight">
            {project.name}
          </h3>
          <p className="text-sm sm:text-base md:text-xl 2xl:text-2xl text-slate-400 font-light">
            {project.subtitle}
          </p>
        </div>

        <p className="text-slate-500 text-sm md:text-base 2xl:text-lg leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          {isRepoDisabled ? (
            <span className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-50">
              <Github size={18} /> Repository
            </span>
          ) : (
            <motion.a
              href={project.repoLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              <Github size={18} /> Repository
            </motion.a>
          )}

          {isLiveDisabled ? (
            <span className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl bg-white/5 text-slate-600 cursor-not-allowed opacity-50">
              <ExternalLink size={18} /> Live Demo
            </span>
          ) : (
            <motion.a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
            >
              <ExternalLink size={18} /> Live Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedProjects;
