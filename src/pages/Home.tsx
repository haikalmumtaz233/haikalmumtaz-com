import Hero from '../components/home/Hero';
import Identity from '../components/home/Identity';
import Experience from '../components/home/Experience';
import FeaturedProjects from '../components/home/FeaturedProjects';

const Home = () => {
  return (
    <div className="relative">
      {/* === BACKGROUND GRID PATTERN === */}
      <div className="absolute inset-0 bg-gray-950">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(55, 65, 81) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(55, 65, 81) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-blue-900/10" />
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10">
        <Hero />
        <Identity />
        <Experience />
        <FeaturedProjects />
      </div>
    </div>
  );
};

export default Home;
