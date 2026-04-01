import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';

interface FeaturedCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const FeaturedCard = memo(({ project, onClick }: FeaturedCardProps) => {
  return (
    <motion.article
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden h-full"
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
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-60`}
        />
        <motion.img
          src={project.image}
          alt={project.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md text-slate-300 text-[11px] font-mono rounded-full tracking-wider uppercase border border-white/15">
          {project.category}
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="flex items-center gap-2 text-white text-sm font-semibold tracking-wide bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
          >
            View Project <ArrowUpRight size={16} />
          </motion.span>
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg sm:text-xl font-monument font-black text-white tracking-tight leading-tight line-clamp-1">
            {project.name}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm font-light mt-0.5 line-clamp-1">
            {project.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 3).map((tech, i) => (
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

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
