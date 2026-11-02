import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectModal from '../projects/ProjectModal';
import FeaturedDeck from './FeaturedDeck';
import FeaturedStage from './FeaturedStage';
import FeaturedTabs from './FeaturedTabs';
import FeaturedPreview from './FeaturedPreview';
import FeaturedMeta from './FeaturedMeta';
import { useIsMobile, useMediaQuery } from '../../hooks/useMediaQuery';
import SectionHeader from '../ui/SectionHeader';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const PIN_QUERY = '(min-width: 1024px) and (min-height: 640px)';

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const fitsPinnedStage = useMediaQuery(PIN_QUERY);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [active, setActive] = useState({ index: 0, direction: 1 });
  const sectionRef = useRef<HTMLElement>(null);

  const featuredProjects = useMemo(() => projects.filter((p) => p.isFeatured), []);
  const isPinned = fitsPinnedStage && !prefersReducedMotion;
  const activeProject = featuredProjects[active.index];

  const handleCloseModal = useCallback(() => setSelectedProject(null), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        featuredProjects.forEach((project) => {
          const image = new Image();
          image.decoding = 'async';
          image.src = project.image;
        });
      },
      { rootMargin: '600px 0px' },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [featuredProjects]);

  const select = (index: number) => {
    if (index === active.index || index < 0 || index >= featuredProjects.length) return;
    setActive({ index, direction: index > active.index ? 1 : -1 });
  };

  const header = (
    <SectionHeader
      section="projects"
      title={['Featured work']}
      className={isPinned ? 'mb-8! 2xl:mb-12!' : ''}
      meta={
        <button
          type="button"
          onClick={() => navigate('/projects', { viewTransition: true })}
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-hull/85 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:border-white/50 md:text-base"
        >
          Browse all {projects.length} projects
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      }
    />
  );

  const renderLayout = () => {
    if (isMobile) {
      return (
        <div className="shell">
          {header}
          <FeaturedDeck projects={featuredProjects} onOpen={setSelectedProject} />
        </div>
      );
    }

    if (isPinned) {
      return (
        <FeaturedStage projects={featuredProjects} header={header} onOpen={setSelectedProject} />
      );
    }

    return (
      <div className="shell">
        {header}
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:order-2">
            <FeaturedPreview
              project={activeProject}
              index={active.index}
              direction={active.direction}
              onOpen={setSelectedProject}
              onSwipe={(step) => select(active.index + step)}
              className="aspect-16/10"
            />
            <FeaturedMeta
              project={activeProject}
              index={active.index}
              count={featuredProjects.length}
            />
          </div>
          <div className="lg:col-span-5 lg:order-1">
            <FeaturedTabs
              projects={featuredProjects}
              activeIndex={active.index}
              onSelect={select}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-x-clip ${isPinned ? '' : 'section-space'}`}
    >
      {renderLayout()}
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </section>
  );
};

export default FeaturedProjects;
