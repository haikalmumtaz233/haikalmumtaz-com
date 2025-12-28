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
    <section ref={targetRef} className="relative bg-white py-16 md:py-20 overflow-hidden">
      {/* === FADE OVERLAY LEFT === */}
      <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />

      {/* === FADE OVERLAY RIGHT === */}
      <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

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
          className="flex items-center gap-6 md:gap-10 pr-6 md:pr-10"
        >
          {duplicatedIdentities.map((identity, index) => (
            <div key={index} className="flex items-center gap-6 md:gap-10 flex-shrink-0">
              {/* === IDENTITY TEXT === */}
              <span
                className={`text-4xl md:text-6xl font-black uppercase tracking-tighter whitespace-nowrap ${
                  identity.filled
                    ? 'text-black'
                    : 'text-transparent'
                }`}
                style={
                  !identity.filled
                    ? {
                        WebkitTextStroke: '1px black',
                      }
                    : undefined
                }
              >
                {identity.text}
              </span>

              {/* === SEPARATOR === */}
              <span className="text-4xl md:text-6xl text-purple-600 font-black">
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
