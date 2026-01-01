import { useLayoutEffect } from 'react';
import Hero from '../components/home/Hero';
// import Identity from '../components/home/Identity';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Experience from '../components/home/Experience';
import TechStack from '../components/home/TechStack';
import Tools from '../components/home/Tools';
import Certifications from '../components/home/Certifications';
import FavoriteMoments from '../components/home/FavoriteMoments';
import Contact from '../components/home/Contact';

const Home = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="relative z-10 space-y-24 md:space-y-32 pb-24 md:pb-32">
        <Hero />
        {/* <Identity /> */}

        <div id="projects">
          <FeaturedProjects />
        </div>

        <div id="experience">
          <Experience />
        </div>

        <div id="techstack">
          <TechStack />
        </div>

        <div id="tools">
          <Tools />
        </div>

        <div id="certifications">
          <Certifications />
        </div>

        <div id="favoritemoments">
          <FavoriteMoments />
        </div>

        <div id="contact">
          <Contact />
        </div>
      </div>
    </>
  );
};

export default Home;