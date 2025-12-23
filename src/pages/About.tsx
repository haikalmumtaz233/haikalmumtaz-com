import { motion, useInView } from 'framer-motion';
import { User, GraduationCap, Award, Briefcase } from 'lucide-react';
import { useRef } from 'react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-transparent py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto"
        >
          {/* === LEFT COLUMN - IMAGE === */}
          <motion.div
            variants={imageVariants}
            className="relative flex justify-center lg:justify-start order-1 lg:order-1"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="relative"
            >
              {/* === ROTATING GRADIENT RING === */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-70"
              ></motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 bg-gradient-to-bl from-pink-500 via-purple-500 to-cyan-500 rounded-3xl opacity-40 blur-2xl"
              ></motion.div>
              
              {/* === IMAGE CONTAINER === */}
              <div className="relative w-80 h-96 md:w-96 md:h-[480px] bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl border-4 border-white/20 overflow-hidden backdrop-blur-xl shadow-2xl shadow-purple-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.15),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]"></div>
                
                {/* === PLACEHOLDER IMAGE === */}
                <div className="relative w-full h-full flex items-center justify-center bg-gray-900/30">
                  <User size={120} className="text-gray-500" />
                </div>
              </div>

              {/* === DECORATIVE ELEMENTS === */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-60"
              ></motion.div>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60"
              ></motion.div>
            </motion.div>
          </motion.div>

          {/* === RIGHT COLUMN - CONTENT === */}
          <motion.div
            variants={containerVariants}
            className="order-2 lg:order-2 space-y-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            >
              Behind the Code
            </motion.h1>

            <motion.div variants={itemVariants} className="space-y-5 text-gray-300 leading-relaxed">
              <p className="text-base md:text-lg">
                Hey there! I'm <span className="text-gradient font-semibold">Muhammad Raditya Haikal Mumtaz</span>, 
                a fresh graduate from <span className="text-white font-medium">UPN "Veteran" Yogyakarta</span> with 
                a degree in Computer Science. My journey into tech started in the most unexpected way—through my 
                love for <span className="text-cyan-400 font-medium">games</span>. What began as countless hours 
                of gaming evolved into a burning curiosity about how these virtual worlds actually worked.
              </p>

              <p className="text-base md:text-lg">
                That curiosity led me down the rabbit hole of programming, where I discovered my passion for 
                building <span className="text-gradient font-semibold">Full-Stack</span> applications and diving 
                deep into <span className="text-gradient font-semibold">Machine Learning</span>. I'm the kind 
                of developer who loves prototyping—taking ideas from concept to reality, experimenting with new 
                technologies, and pushing the boundaries of what's possible. Whether it's crafting seamless web 
                experiences or training AI models to solve real-world problems, I'm always eager to learn and grow.
              </p>

              <p className="text-base md:text-lg">
                As a <span className="text-purple-400 font-medium">fast learner</span> and eternal 
                <span className="text-cyan-400 font-medium"> gamer</span> at heart, I approach every project 
                with the same enthusiasm I had when I first discovered coding. I'm constantly exploring emerging 
                technologies, building innovative solutions, and embracing challenges that help me evolve as a developer. 
                Let's create something amazing together!
              </p>
            </motion.div>

            {/* === STATS === */}
            <motion.div
              variants={itemVariants}
              className="relative mt-12 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-xl shadow-black/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
              
              <div className="relative grid grid-cols-3 gap-6 md:gap-8">
                {/* === STAT 1 === */}
                <div className="text-center relative">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2 leading-none">
                    2025
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Graduate</div>
                </div>
                
                {/* === DIVIDER 1 === */}
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block"></div>
                
                {/* === STAT 2 === */}
                <div className="text-center relative">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-2 leading-none">
                    10+
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Projects</div>
                </div>
                
                {/* === DIVIDER 2 === */}
                <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block"></div>
                
                {/* === STAT 3 === */}
                <div className="text-center relative">
                  <div className="text-5xl md:text-6xl font-black bg-gradient-to-br from-pink-400 via-rose-300 to-orange-400 bg-clip-text text-transparent mb-2 leading-none">
                    ∞
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Ideas</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* === SECTION DIVIDER === */}
        <div className="max-w-7xl mx-auto mt-20 md:mt-24 mb-20 md:mb-24">
          <div className="relative h-px w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-sm"></div>
          </div>
        </div>

        {/* === EDUCATION & CERTIFICATIONS === */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            Education & Certifications
          </h2>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* === EDUCATION CARD === */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative md:col-span-2 group overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500"
            >
              {/* === BACKGROUND PATTERN === */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
              </div>
              
              {/* === GLASS SHINE EFFECT === */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
                <div className="w-32 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
              </div>

              <div className="relative flex flex-col sm:flex-row items-start gap-6">
                <div className="p-4 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/20">
                  <GraduationCap size={48} className="text-cyan-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Bachelor of Informatics
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg font-medium mb-1">
                    UPN "Veteran" Yogyakarta
                  </p>
                  <p className="text-gray-400 text-sm md:text-base mb-4">2021 - 2025</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full">
                    <span className="text-cyan-300 text-base md:text-lg font-bold">GPA: 3.88/4.00</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* === CERTIFICATION CARD 1 === */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative group overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-500"
            >
              {/* === GLASS SHINE EFFECT === */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
                <div className="w-24 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl ring-2 ring-purple-500/30">
                  <Award size={32} className="text-purple-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    TensorFlow Developer
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base font-medium">
                    Google Developers
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">Certified Professional</p>
                </div>
              </div>
            </motion.div>

            {/* === CERTIFICATION CARD 2 === */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative group overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 hover:border-indigo-500/50 transition-all duration-500"
            >
              {/* === GLASS SHINE EFFECT === */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
                <div className="w-24 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
              </div>

              <div className="relative flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl ring-2 ring-indigo-500/30">
                  <Award size={32} className="text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    Associate Data Scientist
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base font-medium">
                    BNSP Indonesia
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">Professional Certificate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* === SECTION DIVIDER === */}
        <div className="max-w-7xl mx-auto mt-20 md:mt-24 mb-20 md:mb-24">
          <div className="relative h-px w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/30 to-transparent blur-sm"></div>
          </div>
        </div>

        {/* === EXPERIENCE TIMELINE === */}
        <ExperienceTimeline />
      </div>
    </section>
  );
};

const ExperienceTimeline = () => {
  const experiences = [
    {
      role: 'Fullstack Developer Intern',
      company: 'Ruang Media Solusi',
      period: 'Nov 2025 - Present',
      color: 'cyan',
      achievements: [
        'Developed School Profile Website using Vue.js and Tailwind CSS',
        'Implemented responsive and modern UI/UX design',
        'Collaborated with team on fullstack development tasks',
      ],
    },
    {
      role: 'Fullstack Developer Intern',
      company: 'Horus Technology',
      period: 'Oct 2025 - Nov 2025',
      color: 'purple',
      achievements: [
        'Built features for TING App using modern web technologies',
        'Designed and developed landing page with engaging UI',
        'Worked on both frontend and backend implementation',
      ],
    },
    {
      role: 'Laboratory Assistant',
      company: 'Informatics Lab - UPN Veteran Yogyakarta',
      period: 'Aug 2022 - Jul 2025',
      color: 'blue',
      achievements: [
        'Mentored 200+ students across 8 different courses',
        'Taught Database, IoT, Web Development, and other technical subjects',
        'Developed teaching materials and practical lab exercises',
      ],
    },
    {
      role: 'Deputy Head of Web Development',
      company: 'IT Club - UPN Veteran Yogyakarta',
      period: 'Jul 2023 - Aug 2024',
      color: 'pink',
      achievements: [
        'Led training programs for React and Express.js',
        'Organized workshops and coding bootcamps',
        'Managed web development team and project coordination',
      ],
    },
  ];

  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={timelineRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="max-w-7xl mx-auto"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
        Professional Experience
      </h2>

      <div className="relative">
        {/* === GRADIENT FADE TOP === */}
        <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 -top-8 w-0.5 h-8 bg-gradient-to-b from-transparent to-cyan-500/50 z-0"></div>
        
        {/* === TIMELINE LINE === */}
        <motion.div
          initial={{ height: 0 }}
          animate={isInView ? { height: '100%' } : { height: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 md:transform md:-translate-x-1/2"
        />
        
        {/* === GRADIENT FADE BOTTOM === */}
        <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 -bottom-8 w-0.5 h-8 bg-gradient-to-t from-transparent to-pink-500/50 z-0"></div>

        {/* === EXPERIENCE CARDS === */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceCard = ({ experience, index }: { experience: any; index: number }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const isActive = useInView(cardRef, { amount: 0.5 });

  const isEven = index % 2 === 0;
  
  const colorMap: any = {
    cyan: {
      dot: 'from-cyan-400 to-cyan-500',
      dotActive: 'from-cyan-300 to-cyan-400',
      ping: 'bg-cyan-400',
      border: 'border-l-cyan-500',
      connector: 'bg-cyan-500',
    },
    purple: {
      dot: 'from-purple-400 to-purple-500',
      dotActive: 'from-purple-300 to-purple-400',
      ping: 'bg-purple-400',
      border: 'border-l-purple-500',
      connector: 'bg-purple-500',
    },
    blue: {
      dot: 'from-blue-400 to-blue-500',
      dotActive: 'from-blue-300 to-blue-400',
      ping: 'bg-blue-400',
      border: 'border-l-blue-500',
      connector: 'bg-blue-500',
    },
    pink: {
      dot: 'from-pink-400 to-pink-500',
      dotActive: 'from-pink-300 to-pink-400',
      ping: 'bg-pink-400',
      border: 'border-l-pink-500',
      connector: 'bg-pink-500',
    },
  };

  const colors = colorMap[experience.color] || colorMap.cyan;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex items-center ${
        isEven ? 'justify-start' : 'md:justify-end'
      }`}
    >
      {/* === CONNECTOR NODE WITH PING === */}
      <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 md:transform md:-translate-x-1/2 z-20">
        {/* === PING ANIMATION === */}
        {isActive && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className={`absolute inset-0 rounded-full ${colors.ping} blur-sm`}
          ></motion.div>
        )}
        
        {/* === DOT === */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
          className={`relative w-4 h-4 rounded-full bg-gradient-to-br ${
            isActive ? colors.dotActive : colors.dot
          } ring-4 ring-gray-900 shadow-lg transition-all duration-300`}
        />
      </div>

      {/* === HORIZONTAL CONNECTOR LINE === */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: '3.5rem' } : { width: 0 }}
        transition={{ duration: 0.4, delay: index * 0.2 + 0.5 }}
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
          isEven ? 'right-[calc(50%+0.5rem)]' : 'left-[calc(50%+0.5rem)]'
        } h-0.5 ${colors.connector} opacity-50 z-10`}
        style={{
          transformOrigin: isEven ? 'right' : 'left'
        }}
      />

      {/* === CARD CONTENT === */}
      <div
        className={`ml-12 md:ml-0 md:w-[calc(50%-3.5rem)] ${
          isEven ? 'md:pr-0' : 'md:pl-0'
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.02, x: isEven ? 4 : -4 }}
          className={`relative backdrop-blur-sm bg-white/[0.02] ${
            isEven 
              ? `border-l border-t border-b border-white/5 border-r-4 ${colors.border.replace('border-l', 'border-r')}` 
              : `border-r border-t border-b border-white/5 border-l-4 ${colors.border}`
          } rounded-2xl p-6 hover:bg-white/[0.05] transition-all group ${
            isEven ? 'md:ml-auto md:text-right' : 'md:mr-auto md:text-left'
          }`}
        >
          {/* === ICON === */}
          <div className={`flex items-start gap-4 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className="p-3 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10">
              <Briefcase size={24} className="text-gray-300" />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 ${isEven ? 'md:text-right' : ''}`}>
                {experience.role}
              </h3>
              <p className={`text-gray-400 text-sm font-medium ${isEven ? 'md:text-right' : ''}`}>
                {experience.company}
              </p>
              <p className={`text-gray-500 text-xs mt-1 ${isEven ? 'md:text-right' : ''}`}>{experience.period}</p>
            </div>
          </div>

          {/* === ACHIEVEMENTS === */}
          <ul className={`space-y-2 ${isEven ? 'ml-16 md:ml-0 md:mr-16' : 'ml-16'}`}>
            {experience.achievements.map((achievement: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.2 + 0.4 + idx * 0.1 }}
                className={`text-gray-300 text-sm flex items-start gap-2 ${isEven ? 'md:flex-row-reverse md:text-right' : ''}`}
              >
                <span className="text-cyan-400 mt-1.5 text-xs">•</span>
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
