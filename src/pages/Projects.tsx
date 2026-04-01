import ProjectsHero from '../components/projects/ProjectsHero';
import ProjectsGrid from '../components/projects/ProjectsGrid';
import ProjectsBackground from '../components/projects/ProjectsBackground';

const Projects = () => {
  return (
    <>
      <ProjectsBackground />
      <div className="relative z-10">
        <ProjectsHero />
        <ProjectsGrid />
      </div>
    </>
  );
};

export default Projects;
