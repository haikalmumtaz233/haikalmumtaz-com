import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Projects = () => {
  useDocumentTitle('Projects');

  return (
    <div className="relative z-10">
      <ProjectsHero />
      <ProjectsGrid />
    </div>
  );
};

export default Projects;
