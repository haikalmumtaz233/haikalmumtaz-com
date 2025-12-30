import { motion } from 'framer-motion';
import { tools } from '../../data/tools';

const Tools = () => {
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '100%' },
    visible: {
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      },
    },
  }

  const toolsTrack = [...tools, ...tools]; 

  return (
    <section className="relative bg-transparent py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* === HEADER === */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <div className="overflow-hidden">
            <motion.h2
              variants={wordVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4"
            >
              Tools & Software
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.p
              variants={wordVariants}
              className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
            >
              My digital arsenal for development and design.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* === INFINITE SCROLL MARQUEE === */}
      <div className="w-full overflow-hidden relative flex">
        <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 z-10 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        
        <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 z-10 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* === TRACK 1 === */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: 20,
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-4 pr-4 flex-shrink-0"
        >
          {toolsTrack.map((tool, index) => (
            <div
              key={`t1-${index}`}
              className="w-32 h-32 md:w-36 md:h-36 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-sm md:text-base font-mono text-gray-400 group-hover:text-white transition-colors duration-300 text-center px-2">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* === TRACK 2 === */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-4 pr-4 flex-shrink-0"
        >
          {toolsTrack.map((tool, index) => (
            <div
              key={`t2-${index}`}
              className="w-32 h-32 md:w-36 md:h-36 flex flex-col items-center justify-center gap-2 flex-shrink-0 hover:bg-white/5 rounded-2xl transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img
                  src={tool.logo}
                  alt={tool.name}
                  className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-sm md:text-base font-mono text-gray-400 group-hover:text-white transition-colors duration-300 text-center px-2">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Tools;