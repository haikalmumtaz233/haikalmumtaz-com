import { useMemo, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import { ALL_DOMAINS, domainFilters, filterByDomain } from '../../lib/projectIndex';
import { easing } from '../../lib/motion';
import { useIsMobile, useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import DomainFilter from './DomainFilter';
import IndexRow from './IndexRow';
import IndexPreview from './IndexPreview';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

const filters = domainFilters(projects);

interface ProjectsIndexProps {
  onOpen: (project: Project) => void;
}

const ProjectsIndex = ({ onOpen }: ProjectsIndexProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const [selectedDomain, setSelectedDomain] = useState<string>(ALL_DOMAINS);
  const [hovered, setHovered] = useState<Project | null>(null);

  const visible = useMemo(() => filterByDomain(projects, selectedDomain), [selectedDomain]);
  const selectDomain = (value: string) => {
    setSelectedDomain(value);
    setHovered(null);
  };
  const showPreview = hasFinePointer && !isMobile && !prefersReducedMotion;

  return (
    <section aria-label="Project index" className="relative pb-24 md:pb-32 2xl:pb-40">
      <div className="shell">
        <div className="mb-5 md:mb-6">
          <DomainFilter options={filters} selected={selectedDomain} onSelect={selectDomain} />
        </div>

        <div className="min-h-[60vh]">
          <ul
            className="divide-y divide-white/10 rounded-2xl border border-white/15 bg-[#0d0c14]/92 p-1.5 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.9)] md:p-2"
            onPointerLeave={() => setHovered(null)}
            aria-label="All projects"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project) => (
                <m.li
                  key={project.id}
                  layout={prefersReducedMotion ? false : 'position'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.4,
                    ease: easing.expo,
                    layout: { duration: 0.6, ease: easing.expo },
                  }}
                >
                  <IndexRow
                    project={project}
                    dimmed={hovered !== null && hovered.id !== project.id}
                    onOpen={onOpen}
                    onHover={setHovered}
                  />
                </m.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      {showPreview && <IndexPreview projects={projects} active={hovered} />}
    </section>
  );
};

export default ProjectsIndex;
