import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectModal from '../projects/ProjectModal';
import FeaturedDeck from './FeaturedDeck';
import FeaturedTabs from './FeaturedTabs';
import FeaturedPreview from './FeaturedPreview';
import FeaturedMeta from './FeaturedMeta';
import { useIsMobile } from '../../hooks/useMediaQuery';
import SectionHeader from '../ui/SectionHeader';

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [active, setActive] = useState({ index: 0, direction: 1 });
  const sectionRef = useRef<HTMLElement>(null);

  const featuredProjects = useMemo(() => projects.filter((p) => p.isFeatured), []);
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
      title={['Featured work']}
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

    return (
      <div className="shell">
        {header}
        <div className="grid gap-x-14 gap-y-5 lg:grid-cols-12">
          <FeaturedPreview
            project={activeProject}
            index={active.index}
            direction={active.direction}
            onOpen={setSelectedProject}
            onSwipe={(step) => select(active.index + step)}
            className="aspect-16/10 lg:col-span-7 lg:col-start-6 lg:row-start-1"
          />
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
            <FeaturedMeta project={activeProject} />
          </div>
          <div className="mt-5 lg:relative lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mt-0">
            <div className="lg:absolute lg:inset-0">
              <FeaturedTabs
                projects={featuredProjects}
                activeIndex={active.index}
                onSelect={select}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="relative section-space overflow-x-clip">
      {renderLayout()}
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </section>
  );
};

export default FeaturedProjects;
