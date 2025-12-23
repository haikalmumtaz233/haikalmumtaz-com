import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const FeaturedProjects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const projects = [
    {
      id: 1,
      name: 'TixNow - Cinema Booking',
      category: 'Fullstack Web Dev',
      description:
        'End-to-end cinema ticketing system. Built admin dashboard and user booking interface.',
      stack: ['Vue.js', 'Tailwind CSS', 'Backend API'],
    },
    {
      id: 2,
      name: 'SABER - Energy Prediction',
      category: 'Data Science & IoT',
      description:
        'IoT-based electricity usage forecasting using LSTM models and Time-series analysis.',
      stack: ['Python', 'TensorFlow', 'IoT'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="bg-gray-950 py-12 md:py-16 lg:py-20" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* === SECTION HEADER === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            A showcase of my recent work and case studies
          </p>
        </motion.div>

        {/* === PROJECTS GRID === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-6 md:gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group bg-gray-900 border border-gray-800 rounded-xl p-5 md:p-6 lg:p-8 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
            >
              {/* === CATEGORY TAG === */}
              <span className="inline-block px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-full mb-4">
                {project.category}
              </span>

              {/* === PROJECT TITLE === */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-purple-400 transition-colors">
                {project.name}
              </h3>

              {/* === DESCRIPTION === */}
              <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>

              {/* === TECH STACK === */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* === VIEW CASE STUDY BUTTON === */}
              <button className="flex items-center gap-2 text-purple-400 font-semibold group-hover:gap-4 transition-all">
                View Case Study
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
