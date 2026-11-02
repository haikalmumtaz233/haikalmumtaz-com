import type { Project } from '../../data/projects';

const VISIBLE_STACK = 4;

interface FeaturedMetaProps {
  project: Project;
}

const FeaturedMeta = ({ project }: FeaturedMetaProps) => (
  <ul className="flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
    {project.stack.slice(0, VISIBLE_STACK).map((tech) => (
      <li
        key={tech}
        className="rounded-full border border-white/15 bg-hull/85 px-3 py-1 text-[13px] text-white/85"
      >
        {tech}
      </li>
    ))}
  </ul>
);

export default FeaturedMeta;
