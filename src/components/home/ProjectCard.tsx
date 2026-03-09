import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
};

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const maxVisibleTech = 3;
  const extraTechCount = project.stack.length - maxVisibleTech;

  return (
    <motion.article
      layout
      layoutId={`card-${project.id}`}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors duration-300 hover:border-white/20"
      style={{
        boxShadow: `0 0 0px transparent`,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 30px ${project.accentColor}15, 0 0 60px ${project.accentColor}08`,
        borderColor: `${project.accentColor}40`,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-60`}
        />
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md text-slate-300 text-[11px] font-mono rounded-full tracking-wider uppercase border border-white/15">
          {project.category}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 text-white text-sm font-semibold tracking-wide">
            View Project <ArrowUpRight size={16} />
          </span>
        </div>

        {/* Number */}
        <div className="absolute bottom-2 right-3 z-10 text-5xl font-black text-white/[0.04] pointer-events-none select-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="text-lg sm:text-xl font-monument font-black text-white tracking-tight leading-tight">
            {project.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-light mt-0.5">
            {project.subtitle}
          </p>
        </div>

        {/* Tech stack pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, maxVisibleTech).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-white/5 border border-white/10 text-slate-400 text-[11px] rounded-md font-mono"
            >
              {tech}
            </span>
          ))}
          {extraTechCount > 0 && (
            <span className="px-2 py-1 text-slate-600 text-[11px] font-mono">
              +{extraTechCount}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
