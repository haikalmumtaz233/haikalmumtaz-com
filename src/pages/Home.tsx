import Hero from '../components/home/Hero';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Experience from '../components/home/Experience';
import TechStack from '../components/home/TechStack';
import Tools from '../components/home/Tools';
import Certifications from '../components/home/Certifications';
import FavoriteMoments from '../components/home/FavoriteMoments';
import Contact from '../components/home/Contact';
import SectionAtmosphere from '../journey/SectionAtmosphere';
import { StickyStack, StickyStackItem } from '../journey/StickyStack';

const Home = () => {
  return (
    <StickyStack className="relative z-10">
      <StickyStackItem index={0} pin atmosphere={<SectionAtmosphere />}>
        <Hero />
      </StickyStackItem>

      <StickyStackItem index={1} id="projects">
        <FeaturedProjects />
      </StickyStackItem>

      <StickyStackItem index={2} id="experience">
        <Experience />
      </StickyStackItem>

      <StickyStackItem index={3} id="techstack">
        <TechStack />
      </StickyStackItem>

      <StickyStackItem index={4} id="tools">
        <Tools />
      </StickyStackItem>

      <StickyStackItem index={5} id="certifications" pin>
        <Certifications />
      </StickyStackItem>

      <StickyStackItem index={6} id="favoritemoments">
        <FavoriteMoments />
      </StickyStackItem>

      <StickyStackItem index={7} id="contact">
        <Contact />
      </StickyStackItem>
    </StickyStack>
  );
};

export default Home;
