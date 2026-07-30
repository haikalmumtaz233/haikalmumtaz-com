import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { animatedProps, revealEase } from '../lib/motion';

const NotFound = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="relative z-10 min-h-[70vh] flex items-center py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          {...animatedProps(prefersReducedMotion, {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, ease: revealEase },
          })}
          className="max-w-2xl"
        >
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400 mb-4">
            Error 404
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-monument font-black tracking-tight text-white uppercase mb-4 sm:mb-6">
            Page not found
          </h1>

          <p className="text-slate-400 text-base sm:text-lg font-light mb-8 sm:mb-10 max-w-lg">
            This address does not point to anything on the site. The work is still here, just one
            level up.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/', { viewTransition: true })}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white/90 transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to home
            </button>

            <button
              type="button"
              onClick={() => navigate('/projects', { viewTransition: true })}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-xs uppercase tracking-wider rounded-full transition-colors duration-300"
            >
              Browse projects
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
