import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';
import OptimizedImage from '../ui/OptimizedImage';
import { activateOnEnterOrSpace } from '../../lib/keyboard';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface FeaturedCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const FeaturedCard = memo(({ project, onClick }: FeaturedCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      layoutId={prefersReducedMotion ? undefined : `project-${project.id}`}
      onClick={onClick}
      onKeyDown={activateOnEnterOrSpace(onClick)}
      role="button"
      tabIndex={0}
      aria-label={`Open details for ${project.name}`}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative cursor-pointer rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden h-[220px] md:h-[240px] lg:h-[280px] xl:h-[310px] 2xl:h-[350px]"
      style={
        {
          '--accent': project.accentColor,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
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
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative aspect-[16/10] md:aspect-auto md:w-[50%] lg:w-[55%] overflow-hidden flex-shrink-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-60`}
          />
          <OptimizedImage
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 px-2 py-0.5 md:px-2.5 md:py-1 bg-black/70 backdrop-blur-md text-slate-300 text-[9px] md:text-[10px] lg:text-[11px] font-mono rounded-full tracking-wider uppercase border border-white/15">
            {project.category}
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex items-center gap-1 text-white text-xs md:text-sm font-semibold tracking-wide px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 pointer-events-none">
              View Project <ArrowUpRight className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' size={18} />
            </span>
          </div>
        </div>
        <div className="p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col flex-grow justify-center">
          <div className="mb-2 md:mb-3">
            <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-monument font-black text-white tracking-tight leading-tight line-clamp-1 md:line-clamp-2">
              {project.name}
            </h3>
            <p className="text-slate-400 text-[10px] md:text-xs lg:text-sm font-light mt-0.5 md:mt-1 line-clamp-1 md:line-clamp-2">
              {project.subtitle}
            </p>
          </div>
          <p className="hidden md:block text-slate-400 text-[11px] lg:text-xs xl:text-sm font-light leading-relaxed mb-3 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 md:gap-1.5 mt-auto">
            {project.stack.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 md:px-2 md:py-1 bg-white/5 border border-white/10 text-slate-400 text-[8px] md:text-[10px] lg:text-[11px] rounded-md font-mono"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className="hidden lg:inline-block px-2 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] lg:text-[11px] rounded-md font-mono">
                +{project.stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
