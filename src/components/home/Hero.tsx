import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ['Fullstack Developer', 'Data Scientist'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* === ANIMATION VARIANTS === */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* === GRADIENT GLOW EFFECTS === */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* === TEXT CONTENT === */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              >
                Muhammad Raditya
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Haikal Mumtaz
                </span>
              </motion.h1>

              {/* === ANIMATED ROLE === */}
              <motion.div variants={itemVariants} className="mb-6 h-12">
                <motion.h2
                  key={roleIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-200"
                >
                  {roles[roleIndex]}
                </motion.h2>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                Informatics graduate from UPN "Veteran" Yogyakarta specializing in scalable web
                apps and machine learning solutions.
              </motion.p>

              {/* === CTA BUTTONS === */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-shadow flex items-center justify-center gap-2"
                  >
                    View Work
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-purple-500 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
                >
                  Download CV
                  <Download size={20} />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* === ABSTRACT 3D SHAPES === */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-full h-96">
                {/* === FLOATING SHAPES === */}
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-80 blur-sm"
                ></motion.div>

                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  transition={{ delay: 1 }}
                  className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-80 blur-sm"
                ></motion.div>

                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  transition={{ delay: 2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-80 blur-sm rotate-45"
                ></motion.div>

                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  transition={{ delay: 0.5 }}
                  className="absolute top-32 right-10 w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-full opacity-80 blur-sm"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* === SCROLL INDICATOR === */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
