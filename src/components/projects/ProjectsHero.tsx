import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { animatedProps, easing } from '../../lib/motion';
import SectionHeader from '../ui/SectionHeader';
import { projects } from '../../data/projects';
import { introOffset } from '../../lib/intro';

const categoryCount = new Set(projects.map((project) => project.category)).size;

const ProjectsHero = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [offset] = useState(introOffset);

  return (
    <section className="relative pt-24 md:pt-28 pb-10 md:pb-14">
      <div className="shell">
        <motion.button
          {...animatedProps(prefersReducedMotion, {
            initial: { opacity: 0, x: -12 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.8, ease: easing.expo, delay: offset },
          })}
          onClick={() => navigate('/', { viewTransition: true })}
          className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 mb-10 md:mb-14"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-sm font-medium">Back to home</span>
        </motion.button>

        <SectionHeader
          as="h1"
          title={['All projects']}
          delay={offset + 0.15}
          className="!mb-0"
          meta={
            <p className="text-sm md:text-base text-white/55">
              {projects.length} projects in {categoryCount} categories
            </p>
          }
        />
      </div>
    </section>
  );
};

export default ProjectsHero;
