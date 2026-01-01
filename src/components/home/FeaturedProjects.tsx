import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { projects } from '../../data/projects';

const FeaturedProjects = () => {
  return (
    <section className="relative bg-transparent pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-monument font-black tracking-tight text-white mb-4 uppercase">
            FEATURED WORK
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light">
            My best projects
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {projects.map((project, index) => (
          <Card
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

interface CardProps {
  project: any;
  index: number;
}

const Card = ({ project, index }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const isRepoDisabled = project.repoLink === '#';
  const isLiveDisabled = project.liveLink === '#';

  return (
    <div
      ref={cardRef}
      className="sticky top-0 h-screen flex items-center justify-center"
    >
      <motion.div
        className="w-full max-w-6xl min-h-[60vh] h-auto rounded-3xl overflow-hidden relative mx-4 shadow-2xl border border-white/10 bg-[#121212]"
      >
        <div className="relative w-full h-full grid lg:grid-cols-2">
          
          {/* === BACKGROUND GRADIENT === */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />

          {/* === LEFT: IMAGE === */}
          <div className="relative h-64 sm:h-80 lg:h-full w-full bg-black/50 overflow-hidden order-1 lg:order-1 flex items-center justify-center p-6">
            <motion.img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-contain drop-shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* === RIGHT: CONTENT === */}
          <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 z-10 order-2 lg:order-2 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#121212]/50 backdrop-blur-sm">
            
            <span className="inline-block w-fit px-4 py-2 bg-white/5 text-gray-400 text-xs font-mono rounded-full mb-6 tracking-wider uppercase border border-white/10">
              {project.category}
            </span>

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter leading-[0.9]">
              {project.name}
            </h3>

            <p className="text-xl text-gray-400 mb-6 font-light">
              {project.subtitle}
            </p>

            <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.stack.map((tech: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg font-mono whitespace-nowrap">
                  {tech}
                </span>
              ))}
            </div>

            {/* === BUTTONS === */}
            <div className="flex flex-wrap gap-4 mt-auto">
              <motion.a
                href={isRepoDisabled ? undefined : project.repoLink}
                target={isRepoDisabled ? undefined : "_blank"}
                rel="noopener noreferrer"
                whileHover={!isRepoDisabled ? { scale: 1.05 } : {}}
                whileTap={!isRepoDisabled ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 font-semibold text-base px-6 py-3 rounded-xl border border-white/20 transition-colors ${
                  isRepoDisabled 
                    ? 'text-gray-600 border-white/5 bg-white/5 cursor-not-allowed opacity-50 pointer-events-none' 
                    : 'text-white hover:border-white/40'
                }`}
                aria-disabled={isRepoDisabled}
              >
                <Github size={20} /> Repository
              </motion.a>

              <motion.a
                href={isLiveDisabled ? undefined : project.liveLink}
                target={isLiveDisabled ? undefined : "_blank"}
                rel="noopener noreferrer"
                whileHover={!isLiveDisabled ? { scale: 1.05 } : {}}
                whileTap={!isLiveDisabled ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 font-semibold text-base px-6 py-3 rounded-xl transition-colors ${
                  isLiveDisabled 
                    ? 'text-gray-500 bg-gray-800 cursor-not-allowed opacity-50 pointer-events-none' 
                    : 'text-black bg-white hover:bg-gray-200'
                }`}
                aria-disabled={isLiveDisabled}
              >
                <ExternalLink size={20} /> Live Demo
              </motion.a>
            </div>

            {/* CARD NUMBER */}
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-6xl md:text-8xl font-black text-white/5 pointer-events-none">
              0{index + 1}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedProjects;