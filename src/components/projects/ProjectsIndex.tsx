import { useMemo, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import { ALL_DOMAINS, domainFilters, filterByDomain } from '../../lib/projectIndex';
import { easing } from '../../lib/motion';
import { useIsMobile, useMediaQuery } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import ProjectsLabel from './ProjectsLabel';
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
  const label = visible.length === 1 ? 'project' : 'projects';

  return (
    <section aria-labelledby="projects-index" className="relative pb-24 md:pb-32 2xl:pb-40">
      <div className="shell">
        <ProjectsLabel id="projects-index" title="Index" meta={`${visible.length} ${label}`} />
        <div className="mt-8 mb-6 md:mt-10 md:mb-8">
          <DomainFilter options={filters} selected={selectedDomain} onSelect={selectDomain} />
        </div>

        <ul
          className="min-h-[60vh] border-t border-white/10"
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

      {showPreview && <IndexPreview projects={projects} active={hovered} />}
    </section>
  );
};

export default ProjectsIndex;
