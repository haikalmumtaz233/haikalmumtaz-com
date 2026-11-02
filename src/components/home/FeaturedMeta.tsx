import { m, type MotionValue } from 'motion/react';
import type { Project } from '../../data/projects';

const VISIBLE_STACK = 4;

const pad = (value: number) => String(value).padStart(2, '0');

interface FeaturedMetaProps {
  project: Project;
  index: number;
  count: number;
  progress?: MotionValue<number>;
}

const FeaturedMeta = ({ project, index, count, progress }: FeaturedMetaProps) => (
  <div className="mt-5 flex items-center justify-between gap-6">
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
    <div className="flex shrink-0 items-center gap-3">
      {progress && (
        <span aria-hidden="true" className="relative h-px w-20 overflow-hidden bg-white/25">
          <m.span className="absolute inset-0 origin-left bg-white" style={{ scaleX: progress }} />
        </span>
      )}
      <span className="font-mono text-sm tabular-nums text-white/85">
        {pad(index + 1)} / {pad(count)}
      </span>
    </div>
  </div>
);

export default FeaturedMeta;
