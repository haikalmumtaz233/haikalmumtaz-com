import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const FeaturedProjects = () => {
  const projects = [
    {
      id: 1,
      name: 'TixNow',
      subtitle: 'Cinema Booking Platform',
      category: 'Fullstack Web Development',
      description:
        'End-to-end cinema ticketing system with admin dashboard and seamless user booking experience.',
      stack: ['Vue.js', 'Tailwind CSS', 'Backend API'],
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      gradient: 'from-purple-900/20 via-transparent to-blue-900/20',
    },
    {
      id: 2,
      name: 'SABER',
      subtitle: 'Energy Prediction System',
      category: 'Data Science & IoT',
      description:
        'IoT-based electricity usage forecasting using LSTM neural networks and time-series analysis.',
      stack: ['Python', 'TensorFlow', 'IoT'],
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
      gradient: 'from-cyan-900/20 via-transparent to-teal-900/20',
    },
    {
      id: 3,
      name: 'Portfolio',
      subtitle: 'Creative Developer Showcase',
      category: 'Frontend Development',
      description:
        'Modern, interactive portfolio website showcasing projects with advanced animations and smooth user experience.',
      stack: ['React', 'Framer Motion', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1545665277-5937bf04a560?w=800&q=80',
      gradient: 'from-pink-900/20 via-transparent to-orange-900/20',
    },
  ];

  return (
    <section className="relative bg-[#0a0a0a] pb-20">
      {/* === SECTION HEADER === */}
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

      {/* === STICKY CARDS STACK === */}
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
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div
      ref={cardRef}
      className="h-screen flex items-center justify-center sticky top-0"
      style={{ paddingTop: `${index * 20}px` }}
    >
      <motion.div
        style={{ scale, opacity }}
        className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative mx-4"
      >
        {/* === CARD CONTAINER === */}
        <div className={`relative w-full h-full bg-gradient-to-br ${project.gradient} border border-white/10 backdrop-blur-sm`}>
          {/* === GRID LAYOUT === */}
          <div className="grid lg:grid-cols-2 h-full">
            {/* === IMAGE SIDE === */}
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

            {/* === CONTENT SIDE === */}
            <div className="relative flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-[#1a1a1a]/90 backdrop-blur-sm">
              {/* === CATEGORY === */}
              <span className="inline-block w-fit px-4 py-2 bg-white/5 text-gray-400 text-xs font-mono rounded-full mb-6 tracking-wider uppercase border border-white/10">
                {project.category}
              </span>

              {/* === TITLE === */}
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tighter">
                {project.name}
              </h3>

              {/* === SUBTITLE === */}
              <p className="text-xl md:text-2xl text-gray-400 mb-6 font-light">
                {project.subtitle}
              </p>

              {/* === DESCRIPTION === */}
              <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
                {project.description}
              </p>

              {/* === TECH STACK === */}
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

              {/* === CTA BUTTON === */}
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 text-white font-semibold text-lg group bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/20 transition-colors w-fit"
              >
                View Case Study
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* === CARD NUMBER === */}
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
