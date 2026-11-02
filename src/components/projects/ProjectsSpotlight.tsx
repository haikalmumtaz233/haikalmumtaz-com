import { projects } from '../../data/projects';
import type { Project } from '../../data/projects';
import ProjectsLabel from './ProjectsLabel';
import SpotlightRow from './SpotlightRow';

const SPOTLIGHT_COUNT = 3;

const spotlight = projects.filter((project) => project.isFeatured).slice(0, SPOTLIGHT_COUNT);

interface ProjectsSpotlightProps {
  onOpen: (project: Project) => void;
}

const ProjectsSpotlight = ({ onOpen }: ProjectsSpotlightProps) => (
  <section aria-labelledby="projects-spotlight" className="relative pb-24 md:pb-36">
    <div className="shell">
      <ProjectsLabel
        id="projects-spotlight"
        title="Selected work"
        meta={`${spotlight.length} highlights`}
      />
      <ul className="mt-12 grid gap-20 md:mt-16 md:gap-28 2xl:gap-36">
        {spotlight.map((project, index) => (
          <SpotlightRow
            key={project.id}
            project={project}
            reversed={index % 2 === 1}
            eager={index === 0}
            onOpen={onOpen}
          />
        ))}
      </ul>
    </div>
  </section>
);

export default ProjectsSpotlight;
