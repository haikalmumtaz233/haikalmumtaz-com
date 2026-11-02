import type { ReactNode } from 'react';

interface ProjectsLabelProps {
  id: string;
  title: string;
  meta: ReactNode;
}

const ProjectsLabel = ({ id, title, meta }: ProjectsLabelProps) => (
  <div className="flex items-baseline justify-between gap-6 border-t border-white/10 pt-5">
    <h2 id={id} className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
      {title}
    </h2>
    <p className="text-xs tabular-nums text-white/45">{meta}</p>
  </div>
);

export default ProjectsLabel;
