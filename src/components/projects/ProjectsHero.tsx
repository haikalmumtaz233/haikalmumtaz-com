import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProjectsHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-40 pb-10 sm:pb-14 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300 mb-8 sm:mb-12"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-monument font-black tracking-tight text-white mb-4 sm:mb-6 uppercase">
            ALL PROJECTS
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl 2xl:text-2xl font-light max-w-2xl">
            A complete collection of my work across different technologies and domains.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsHero;
