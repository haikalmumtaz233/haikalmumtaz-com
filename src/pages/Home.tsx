import { useLayoutEffect } from 'react';
// Pastikan import ini mengarah ke file Hero yang BARU & BERSIH
// Jika kamu sudah rename jadi HeroSection, ubah jadi: import HeroSection from '../components/home/HeroSection';
import Hero from '../components/home/Hero'; 
import Identity from '../components/home/Identity';
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
        <Identity />
        
        {/* PROOF: Show work immediately */}
        <FeaturedProjects />
        
        {/* TRUST: Show experience */}
        <Experience />
        
        {/* HOW: Show skills */}
        <TechStack />
        <Tools />
        
        {/* VALIDATION: Show awards */}
        <Certifications />
        
        {/* HUMAN: Show personality */}
        <FavoriteMoments />
        
        {/* ACTION: Close with contact */}
        <div id="contact">
          <Contact />
        </div>
      </div>
    </>
  );
};

export default Home;