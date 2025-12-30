import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import { projects } from '../../data/projects'; // Import Data

const FeaturedProjects = () => {
  // Array projects dihapus dari sini karena sudah di import

  return (
    <section className="relative bg-[#0a0a0a] pb-20">
       {/* ... SISA KODE SAMA (Render mapping projects) ... */}
       {/* Pastikan code dibawah ini tetap ada */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-32 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4">
            Featured Work
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light">
            Selected projects & case studies
          </p>
        </motion.div>
      </div>

      <div className="relative">
        {projects.map((project, index) => (
          <Card
            key={project.id}
            project={project}
            index={index}
            totalCards={projects.length}
          />
        ))}
      </div>
    </section>
  );
};

/* === STICKY CARD COMPONENT === */
// ... (Card component code remains unchanged)
// ... (Pastikan Card component tetap ada di bawah)
interface CardProps {
  project: any;
  index: number;
  totalCards: number;
}

const Card = ({ project, index, totalCards }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - index) * 0.05;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="h-screen flex items-center justify-center sticky top-0"
      style={{ paddingTop: `${index * 20}px` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative mx-4"
      >
        <div className="relative w-full h-full bg-[#121212]">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          
          <div className="relative grid lg:grid-cols-2 h-full z-10">
            <div className="relative overflow-hidden">
              <motion.img
                src={project.image}
                alt={project.name}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </div>

            <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-[#1a1a1a] backdrop-blur-sm">
              <span className="inline-block w-fit px-4 py-2 bg-white/5 text-gray-400 text-xs font-mono rounded-full mb-6 tracking-wider uppercase border border-white/10">
                {project.category}
              </span>

              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tighter">
                {project.name}
              </h3>

              <p className="text-xl md:text-2xl text-gray-400 mb-6 font-light">
                {project.subtitle}
              </p>

              <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10">
                {project.stack.map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-white font-semibold text-base px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-colors"
                >
                  <Github size={20} />
                  Repository
                </motion.a>

                <motion.a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-black font-semibold text-base px-6 py-3 rounded-xl bg-white hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </motion.a>
              </div>

              <div className="absolute bottom-8 right-8 text-8xl font-black text-white/5">
                0{index + 1}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturedProjects;