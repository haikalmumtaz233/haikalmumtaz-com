import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const roles = ['Fullstack Developer', 'Data Scientist', 'IoT Enthusiast'];

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden flex items-center">
      {/* === GRADIENT GLOW EFFECTS === */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
          {/* === TEXT CONTENT === */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white mb-6 leading-none"
            >
              Muhammad Raditya
              <br />
              Haikal Mumtaz
            </motion.h1>

            {/* === TYPEWRITER ROLE === */}
            <motion.div variants={itemVariants} className="mb-8 h-16 flex items-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {displayText}
                <span className="animate-pulse">|</span>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-400 mb-10 max-w-lg leading-relaxed"
            >
              Informatics graduate from UPN "Veteran" Yogyakarta specializing in scalable web
              apps and machine learning solutions. Passionate about building innovative technology.
            </motion.p>

            {/* === CTA BUTTONS === */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 transition-shadow"
                >
                  View Work
                  <ArrowRight size={20} />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-full backdrop-blur-sm hover:border-cyan-400 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                Download CV
                <Download size={20} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* === ABSTRACT GLOWING ORBS === */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex items-center justify-center relative h-[600px]"
          >
            <div className="relative w-full h-full">
              {/* === GLOWING ORB 1 - CYAN/BLUE === */}
              <motion.div
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-full blur-[100px] opacity-70"
              ></motion.div>

              {/* === GLOWING ORB 2 - PURPLE/PINK === */}
              <motion.div
                animate={{
                  y: [0, 40, 0],
                  x: [0, -30, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, -120, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: 1,
                }}
                className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-full blur-[120px] opacity-60"
              ></motion.div>

              {/* === GLOWING ORB 3 - INDIGO/VIOLET === */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  x: [0, 15, 0],
                  scale: [1, 1.15, 1],
                  rotate: [0, 60, 0],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: 0.5,
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 rounded-full blur-3xl opacity-50"
              ></motion.div>

              {/* === GLASS CARD OVERLAY === */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 w-[400px] h-[500px] shadow-2xl">
                  {/* === CODE SNIPPET ABSTRACT === */}
                  <div className="space-y-4">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex gap-2"
                    >
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </motion.div>

                    <div className="space-y-3 pt-6">
                      <motion.div
                        animate={{ width: ['70%', '90%', '70%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                        className="h-4 bg-gradient-to-r from-cyan-400/40 to-cyan-500/40 rounded-lg"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['50%', '75%', '50%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                        className="h-4 bg-gradient-to-r from-purple-400/40 to-purple-500/40 rounded-lg ml-8"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['60%', '85%', '60%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
                        className="h-4 bg-gradient-to-r from-blue-400/40 to-blue-500/40 rounded-lg ml-8"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['40%', '65%', '40%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
                        className="h-4 bg-gradient-to-r from-pink-400/40 to-pink-500/40 rounded-lg ml-16"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['55%', '80%', '55%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        className="h-4 bg-gradient-to-r from-indigo-400/40 to-indigo-500/40 rounded-lg ml-8"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['45%', '70%', '45%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
                        className="h-4 bg-gradient-to-r from-violet-400/40 to-violet-500/40 rounded-lg"
                      ></motion.div>

                      <div className="pt-4">
                        <motion.div
                          animate={{ width: ['65%', '88%', '65%'] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1.4 }}
                          className="h-4 bg-gradient-to-r from-teal-400/40 to-teal-500/40 rounded-lg"
                        ></motion.div>
                      </div>

                      <motion.div
                        animate={{ width: ['50%', '72%', '50%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.6 }}
                        className="h-4 bg-gradient-to-r from-emerald-400/40 to-emerald-500/40 rounded-lg ml-8"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['60%', '83%', '60%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
                        className="h-4 bg-gradient-to-r from-sky-400/40 to-sky-500/40 rounded-lg ml-8"
                      ></motion.div>

                      <motion.div
                        animate={{ width: ['70%', '90%', '70%'] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                        className="h-4 bg-gradient-to-r from-rose-400/40 to-rose-500/40 rounded-lg"
                      ></motion.div>
                    </div>

                    {/* === BLINKING CURSOR === */}
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute bottom-8 left-8 w-2 h-6 bg-cyan-400"
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
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
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-white/50 rounded-full"></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

