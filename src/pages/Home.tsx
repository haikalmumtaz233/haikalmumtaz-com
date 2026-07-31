import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Experience from '../components/home/Experience';
import TechStack from '../components/home/TechStack';
import Tools from '../components/home/Tools';
import Certifications from '../components/home/Certifications';
import FavoriteMoments from '../components/home/FavoriteMoments';
import Contact from '../components/home/Contact';
import SectionAtmosphere from '../journey/SectionAtmosphere';

const Home = () => {
  return (
    <div className="relative z-10">
      <div className="relative">
        <SectionAtmosphere />
        <Hero />
      </div>

      <div id="projects" className="relative">
        <FeaturedProjects />
      </div>

      <div id="experience" className="relative">
        <Experience />
      </div>

      <div id="techstack" className="relative">
        <TechStack />
      </div>

      <div id="tools" className="relative">
        <Tools />
      </div>

      <div id="certifications" className="relative">
        <Certifications />
      </div>

      <div id="favoritemoments" className="relative">
        <FavoriteMoments />
      </div>

      <div id="contact" className="relative">
        <Contact />
      </div>
    </div>
  );
};

export default Home;
