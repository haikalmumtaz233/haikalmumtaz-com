import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../../data/projects';

const VISIBLE_STACK = 3;

interface IndexRowProps {
  project: Project;
  dimmed: boolean;
  onOpen: (project: Project) => void;
  onHover: (project: Project) => void;
}

const IndexRow = ({ project, dimmed, onOpen, onHover }: IndexRowProps) => (
  <button
    type="button"
    onClick={() => onOpen(project)}
    onPointerEnter={(event) => {
      if (event.pointerType === 'mouse') onHover(project);
    }}
    className={`group grid w-full grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-x-4 rounded-xl px-2.5 py-3.5 text-left transition-[opacity,background-color] duration-300 hover:bg-white/6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_auto] md:gap-x-8 md:px-5 md:py-5 ${
      dimmed ? 'opacity-50' : 'opacity-100'
    }`}
  >
    <span className="block aspect-16/10 overflow-hidden rounded-md border border-white/15 bg-white/5 md:hidden">
      <img
        src={project.image}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </span>
    <span className="grid min-w-0 gap-1">
      <span className="font-monument text-sm font-black uppercase leading-tight tracking-tight text-white md:text-2xl">
        {project.name}
      </span>
      <span className="truncate text-sm text-white/75 md:text-[15px]">{project.subtitle}</span>
      <span className="text-xs text-white/60 md:hidden">{project.domain}</span>
    </span>
    <span className="hidden items-center gap-2.5 text-sm text-white/80 md:flex">
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: project.accentColor }}
      />
      {project.domain}
    </span>
    <span className="hidden truncate text-sm text-white/60 md:block">
      {project.stack.slice(0, VISIBLE_STACK).join(' · ')}
    </span>
    <ArrowUpRight
      aria-hidden="true"
      size={20}
      className="hidden text-white/55 transition duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white md:block"
    />
  </button>
);

export default IndexRow;
