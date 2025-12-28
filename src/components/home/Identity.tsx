import { motion, useScroll, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';

const Identity = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skewVelocity = useTransform(scrollVelocity, [-2000, 0, 2000], [15, 0, -15]);
  const skew = useTransform(skewVelocity, (value) => `${value}deg`);

  /* === IDENTITY DATA === */
  const identities = [
    { text: 'Fullstack Developer', filled: true },
    { text: 'Machine Learning Engineer', filled: false },
    { text: 'Data Scientist', filled: true },
    { text: 'Game Developer', filled: false },
    { text: 'Gamer', filled: true },
  ];

  /* === DUPLICATE FOR SEAMLESS LOOP === */
  const duplicatedIdentities = [
    ...identities,
    ...identities,
    ...identities,
    ...identities,
    ...identities,
  ];

  return (
    <section ref={targetRef} className="relative bg-transparent py-20 md:py-24 overflow-hidden">
      {/* === FADE OVERLAY LEFT === */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

      {/* === FADE OVERLAY RIGHT === */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

      {/* === KINETIC TYPOGRAPHY STRIP === */}
      <motion.div 
        className="flex items-center"
        style={{ skewX: skew }}
      >
        <motion.div
          animate={{
            x: [-4000, 0],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12"
        >
          {duplicatedIdentities.map((identity, index) => (
            <div key={index} className="flex items-center gap-8 md:gap-12 flex-shrink-0">
              {/* === IDENTITY TEXT === */}
              <span
                className={`text-6xl md:text-8xl font-black uppercase tracking-tighter whitespace-nowrap ${
                  identity.filled
                    ? 'text-white'
                    : 'text-transparent'
                }`}
                style={
                  !identity.filled
                    ? {
                        WebkitTextStroke: '2px white',
                      }
                    : undefined
                }
              >
                {identity.text}
              </span>

              {/* === SEPARATOR === */}
              <span className="text-6xl md:text-8xl text-purple-500 font-black">
                •
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Identity;
