import { motion, useScroll, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';

const TechStack = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skewVelocity = useTransform(scrollVelocity, [-2000, 0, 2000], [15, 0, -15]);
  const skew = useTransform(skewVelocity, (value) => `${value}deg`);

  const skills = [
    { name: 'Java', icon: '☕' },
    { name: 'JavaScript', icon: '⚡' },
    { name: 'Python', icon: '🐍' },
    { name: 'PHP', icon: '🐘' },
    { name: 'SQL', icon: '🗄️' },
    { name: 'React', icon: '⚛️' },
    { name: 'Vue', icon: '💚' },
    { name: 'Tailwind', icon: '🎨' },
    { name: 'Express', icon: '🚂' },
    { name: 'Git', icon: '📦' },
    { name: 'TensorFlow', icon: '🧠' },
  ];

  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <section ref={targetRef} className="relative bg-transparent py-16 md:py-20 overflow-hidden">
      {/* === STRONG FADE OVERLAY LEFT === */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none"></div>

      {/* === STRONG FADE OVERLAY RIGHT === */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-gray-950 via-gray-950/80 to-transparent z-10 pointer-events-none"></div>

      {/* === SCROLLING MARQUEE WITH VELOCITY SKEW === */}
      <motion.div 
        className="flex"
        style={{ skewX: skew }}
      >
        <motion.div
          animate={{
            x: [-1400, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6 pr-6"
        >
          {duplicatedSkills.map((skill, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm"
            >
              <span className="text-3xl md:text-4xl">{skill.icon}</span>
              <span className="text-white/90 font-medium text-lg md:text-xl whitespace-nowrap tracking-tight">
                {skill.name}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TechStack;
