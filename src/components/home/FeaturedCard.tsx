import { memo } from 'react';
import { m } from 'motion/react';
import type { Project } from '../../data/projects';
import OptimizedImage from '../ui/OptimizedImage';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { easing } from '../../lib/motion';

interface FeaturedCardProps {
  project: Project;
  onClick: () => void;
}

const FeaturedCard = memo(({ project, onClick }: FeaturedCardProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <m.article
      layoutId={prefersReducedMotion ? undefined : `project-${project.id}`}
      className="group relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-white/3"
    >
      <div
        className={`absolute inset-0 z-10 bg-linear-to-br ${project.gradient} opacity-40 pointer-events-none transition-opacity duration-500 group-hover:opacity-20`}
      />
      <m.div
        className="h-full w-full"
        initial={prefersReducedMotion ? false : { scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: easing.expo }}
      >
        <OptimizedImage
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
          containerClassName="h-full w-full"
          eager
        />
      </m.div>
      <span className="absolute bottom-4 left-4 z-20 translate-y-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100 group-has-focus-visible:translate-y-0 group-has-focus-visible:opacity-100">
        View details
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open details for ${project.name}`}
        className="absolute inset-0 z-30 rounded-xl"
      />
    </m.article>
  );
});

FeaturedCard.displayName = 'FeaturedCard';

export default FeaturedCard;
