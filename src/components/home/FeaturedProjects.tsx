import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FeaturedProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      id: 1,
      name: 'TixNow',
      subtitle: 'Cinema Booking Platform',
      category: 'Fullstack Web Development',
      description:
        'End-to-end cinema ticketing system with admin dashboard and seamless user booking experience.',
      stack: ['Vue.js', 'Tailwind CSS', 'Backend API'],
      image: '/api/placeholder/800/600',
    },
    {
      id: 2,
      name: 'SABER',
      subtitle: 'Energy Prediction System',
      category: 'Data Science & IoT',
      description:
        'IoT-based electricity usage forecasting using LSTM neural networks and time-series analysis.',
      stack: ['Python', 'TensorFlow', 'IoT'],
      image: '/api/placeholder/800/600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <section className="bg-gray-950 py-20 md:py-32 lg:py-40" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-32"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4">
            Featured Work
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light">
            Selected projects & case studies
          </p>
        </motion.div>

        {/* === PROJECTS STACK === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-32 md:space-y-40"
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* === PROJECT CARD WITH PARALLAX === */
const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
      className="group"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* === IMAGE WITH PARALLAX === */}
        <motion.div
          className={`relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900 rounded-2xl overflow-hidden ${
            index % 2 === 1 ? 'lg:order-2' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"
            style={{ y }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl md:text-8xl opacity-10">{project.name[0]}</div>
            </div>
          </motion.div>
          
          {/* === OVERLAY ON HOVER === */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="text-white text-lg font-semibold"
            >
              View Project
            </motion.div>
          </div>
        </motion.div>

        {/* === CONTENT === */}
        <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
          <span className="inline-block px-4 py-2 bg-white/5 text-gray-400 text-sm font-medium rounded-full mb-6 tracking-wide uppercase">
            {project.category}
          </span>

          <h3 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tighter group-hover:text-gray-300 transition-colors">
            {project.name}
          </h3>

          <p className="text-xl md:text-2xl text-gray-500 mb-8 font-light">
            {project.subtitle}
          </p>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-xl">
            {project.description}
          </p>

          {/* === TECH STACK === */}
          <div className="flex flex-wrap gap-3 mb-10">
            {project.stack.map((tech: string, i: number) => (
              <span
                key={i}
                className="px-4 py-2 bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* === CTA === */}
          <motion.button
            whileHover={{ x: 10 }}
            className="flex items-center gap-3 text-white font-semibold text-lg group/btn"
          >
            View Case Study
            <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
