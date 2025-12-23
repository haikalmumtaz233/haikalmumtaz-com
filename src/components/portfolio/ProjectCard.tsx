import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const categoryColors: Record<string, string> = {
    'Web Dev': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Data Science': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'Mobile & Game': 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  };

  const techColors: Record<string, string> = {
    'Vue.js': 'border-emerald-500/30 text-emerald-400',
    'React': 'border-cyan-500/30 text-cyan-400',
    'Python': 'border-blue-500/30 text-blue-400',
    'TensorFlow': 'border-orange-500/30 text-orange-400',
    'Flutter': 'border-sky-500/30 text-sky-400',
    'Roblox': 'border-red-500/30 text-red-400',
    'PHP': 'border-indigo-500/30 text-indigo-400',
  };

  const getTechColor = (tech: string) => {
    return techColors[tech] || 'border-gray-500/30 text-gray-400';
  };

  const colorClass = categoryColors[project.category] || categoryColors['Web Dev'];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="group relative bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all duration-700 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      {/* === IMAGE SECTION === */}
      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        {/* === ABSTRACT PATTERN === */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* === GLASS OVERLAY === */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent"></div>
        
        {/* === CATEGORY BADGE === */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${colorClass}`}>
            {project.category}
          </span>
        </div>
      </div>

      {/* === CONTENT SECTION === */}
      <div className="p-6 space-y-4">
        {/* === TECH STACK BADGES === */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech, techIndex) => (
            <span
              key={techIndex}
              className={`px-2 py-1 bg-black/30 border rounded-md text-[10px] font-mono font-semibold tracking-wide uppercase transition-all duration-300 ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-1 bg-black/30 border border-gray-500/30 rounded-md text-[10px] font-mono font-semibold tracking-wide text-gray-500">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* === TITLE === */}
        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
          {project.title}
        </h3>

        {/* === DESCRIPTION === */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* === ACTION FOOTER === */}
      <div className="px-6 pb-6 flex items-center justify-end gap-2">
        <motion.a
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="group/icon relative p-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
          aria-label="View repository"
        >
          <Github size={16} className="text-gray-400 group-hover/icon:text-cyan-400 transition-colors" />
          
          {/* === GLOW EFFECT === */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 bg-cyan-500/20 blur-md -z-10"></div>
        </motion.a>

        {project.demoLink && (
          <motion.a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group/icon relative p-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
            aria-label="View live demo"
          >
            <ExternalLink size={16} className="text-gray-400 group-hover/icon:text-purple-400 transition-colors" />
            
            {/* === GLOW EFFECT === */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 bg-purple-500/20 blur-md -z-10"></div>
          </motion.a>
        )}
      </div>

      {/* === HOVER GLOW EFFECT === */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -top-12 left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute -bottom-12 right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-3xl"></div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
