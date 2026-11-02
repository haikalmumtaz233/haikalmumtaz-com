import { useCallback, useState } from 'react';
import type { Project } from '../data/projects';
import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsSpotlight from '../components/projects/ProjectsSpotlight';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import ProjectModal from '../components/projects/ProjectModal';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const Projects = () => {
  useDocumentTitle('Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const handleClose = useCallback(() => setSelectedProject(null), []);

  return (
    <div className="relative z-10">
      <ProjectsHero />
      <ProjectsSpotlight onOpen={setSelectedProject} />
      <ProjectsGrid />
      <ProjectModal project={selectedProject} onClose={handleClose} />
    </div>
  );
};

export default Projects;
