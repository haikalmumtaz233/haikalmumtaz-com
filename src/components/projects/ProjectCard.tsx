import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';
import OptimizedImage from '../ui/OptimizedImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { activateOnEnterOrSpace } from '../../lib/keyboard';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = memo(({ project, onClick }: ProjectCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const maxVisibleTech = 3;

  return (
    <motion.article
      layoutId={prefersReducedMotion ? undefined : `project-${project.id}`}
      onClick={onClick}
      onKeyDown={activateOnEnterOrSpace(onClick)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.name}`}
      className="group relative cursor-pointer h-full flex flex-col"
      style={
        {
          '--accent': project.accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/10] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
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
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0 rounded-xl border border-white/10 bg-white/[0.03]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-60`}
        />
        <OptimizedImage
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
          containerClassName="w-full h-full"
        />
        <span className="absolute bottom-3 left-3 z-20 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-black opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100">
          View details <ArrowUpRight size={15} />
        </span>
      </div>
      <div className="pt-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-monument font-black uppercase text-white tracking-tight leading-tight line-clamp-1">
          {project.name}
        </h3>
        <p className="text-white/65 text-[15px] mt-1.5 line-clamp-1">{project.subtitle}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
          {project.stack.slice(0, maxVisibleTech).map((tech) => (
            <li key={tech} className="rounded-full border border-white/10 px-3 py-1 text-[13px] text-white/60">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
