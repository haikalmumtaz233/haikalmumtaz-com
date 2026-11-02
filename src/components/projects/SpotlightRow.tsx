import { m } from 'motion/react';
import type { Project } from '../../data/projects';
import { projectLinks } from '../../lib/projectIndex';
import { animatedProps, easing } from '../../lib/motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import OptimizedImage from '../ui/OptimizedImage';
import ProjectLinkButton from './ProjectLinkButton';

interface SpotlightRowProps {
  project: Project;
  reversed: boolean;
  eager: boolean;
  onOpen: (project: Project) => void;
}

const SpotlightRow = ({ project, reversed, eager, onOpen }: SpotlightRowProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const links = projectLinks(project);

  return (
    <m.li
      {...animatedProps(prefersReducedMotion, {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 1, ease: easing.expo },
      })}
      className="grid items-center gap-x-12 gap-y-7 md:grid-cols-12 2xl:gap-x-16"
    >
      <m.div
        layoutId={prefersReducedMotion ? undefined : `project-${project.id}`}
        className={`group relative md:col-span-7 ${reversed ? 'md:order-2' : ''}`}
      >
        <div className="relative aspect-16/10 overflow-hidden rounded-xl border border-white/10 bg-white/3">
          <div
            className={`pointer-events-none absolute inset-0 z-10 bg-linear-to-br ${project.gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-20`}
          />
          <OptimizedImage
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
            containerClassName="h-full w-full"
            eager={eager}
          />
          <span className="absolute bottom-4 left-4 z-20 translate-y-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100 group-has-focus-visible:translate-y-0 group-has-focus-visible:opacity-100">
            View details
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`Open details for ${project.name}`}
          className="absolute inset-0 z-30 rounded-xl"
        />
      </m.div>

      <div className="md:col-span-5">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-white/55">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full"
            style={{ backgroundColor: project.accentColor }}
          />
          {project.domain}
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          {project.category}
        </p>
        <h3 className="mt-4 font-monument text-[clamp(1.75rem,3.6vw,3.25rem)] font-black uppercase leading-[0.95] tracking-tight text-white">
          {project.name}
        </h3>
        <p className="mt-3 text-base text-white/70 md:text-lg">{project.subtitle}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-white/60 md:text-base">
          {project.description}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 px-3 py-1 text-[13px] text-white/60"
            >
              {tech}
            </li>
          ))}
        </ul>
        {links.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">
            {links.map((link) => (
              <ProjectLinkButton key={link.href} link={link} projectName={project.name} />
            ))}
          </div>
        )}
      </div>
    </m.li>
  );
};

export default SpotlightRow;
