import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';
import OptimizedImage from '../ui/OptimizedImage';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCard = memo(({ project, index, onClick }: ProjectCardProps) => {
  const maxVisibleTech = 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-all duration-300 h-full flex flex-col"
      style={
        {
          '--accent': project.accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.5), 0 0 20px ${project.accentColor}25, 0 0 45px ${project.accentColor}12`,
          background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, ${project.accentColor}18 100%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1.5px',
          borderRadius: 'inherit',
        }}
      />
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-60`}
        />
        <OptimizedImage
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          containerClassName="w-full h-full"
        />
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md text-slate-300 text-[11px] font-mono rounded-full tracking-wider uppercase border border-white/15">
          {project.category}
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 text-white text-sm font-semibold tracking-wide">
            View Project <ArrowUpRight size={16} />
          </span>
        </div>
        <div className="absolute bottom-2 right-3 z-10 text-5xl font-black text-white/[0.04] pointer-events-none select-none">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-monument font-black text-white tracking-tight leading-tight line-clamp-1">
            {project.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-light mt-0.5 line-clamp-1">
            {project.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.stack.slice(0, maxVisibleTech).map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-white/5 border border-white/10 text-slate-400 text-[11px] rounded-md font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
