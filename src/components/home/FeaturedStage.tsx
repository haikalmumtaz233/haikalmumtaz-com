import { useRef, useState, type ReactNode } from 'react';
import { useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useLenis } from 'lenis/react';
import type { Project } from '../../data/projects';
import { activeIndexAt, segmentTarget } from '../../lib/featuredScroll';
import FeaturedTabs from './FeaturedTabs';
import FeaturedPreview from './FeaturedPreview';
import FeaturedMeta from './FeaturedMeta';

const SEGMENT_SVH = 75;
const IMAGE_DRIFT = 10;

interface FeaturedStageProps {
  projects: Project[];
  header: ReactNode;
  onOpen: (project: Project) => void;
}

const FeaturedStage = ({ projects, header, onOpen }: FeaturedStageProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const count = projects.length;
  const [active, setActive] = useState({ index: 0, direction: 1 });

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = activeIndexAt(progress, count);
    setActive((current) =>
      current.index === next ? current : { index: next, direction: next > current.index ? 1 : -1 },
    );
  });

  const imageY = useTransform(scrollYProgress, (progress) => {
    const local = Math.min(1, Math.max(0, progress) * count - activeIndexAt(progress, count));
    return `${(0.5 - local) * IMAGE_DRIFT}%`;
  });

  const scrollToProject = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.getBoundingClientRect().top + window.scrollY;
    const top = segmentTarget(index, count, start, track.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  const project = projects[active.index];

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `calc(100svh + ${(count - 1) * SEGMENT_SVH}svh)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16">
        <div className="shell">
          {header}
          <div className="grid grid-cols-12 items-start gap-10 xl:gap-14">
            <div className="col-span-5">
              <FeaturedTabs
                projects={projects}
                activeIndex={active.index}
                onSelect={scrollToProject}
              />
            </div>
            <div className="col-span-7">
              <FeaturedPreview
                project={project}
                index={active.index}
                direction={active.direction}
                onOpen={onOpen}
                imageY={imageY}
                className="h-[min(50svh,34rem)]"
              />
              <FeaturedMeta
                project={project}
                index={active.index}
                count={count}
                progress={scrollYProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStage;
