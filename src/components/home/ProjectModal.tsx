import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import { useLenis } from 'lenis/react';
import type { Project } from '../../data/projects';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const lenis = useLenis();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      window.addEventListener('keydown', handleEscape);
    } else {
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
      window.removeEventListener('keydown', handleEscape);
    };
  }, [project, handleEscape, lenis]);

  const isRepoDisabled = !project?.repoLink || project.repoLink === '#';
  const isLiveDisabled = !project?.liveLink || project.liveLink === '#';

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
            style={{
              boxShadow: `0 0 80px ${project.accentColor}15`,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-30 z-10 pointer-events-none`}
              />
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/70 backdrop-blur-md text-slate-300 text-xs font-mono rounded-full tracking-wider uppercase border border-white/15">
                {project.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-monument font-black text-white tracking-tight leading-tight">
                  {project.name}
                </h3>
                <p className="text-slate-400 text-sm sm:text-base font-light mt-1">
                  {project.subtitle}
                </p>
              </div>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {project.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 text-sm rounded-lg font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                {isRepoDisabled ? (
                  <span className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-600 cursor-not-allowed opacity-50">
                    <Github size={18} /> Repository
                  </span>
                ) : (
                  <motion.a
                    href={project.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                  >
                    <Github size={18} /> Repository
                  </motion.a>
                )}

                {isLiveDisabled ? (
                  <span className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl bg-white/5 text-slate-600 cursor-not-allowed opacity-50">
                    <ExternalLink size={18} /> Live Demo
                  </span>
                ) : (
                  <motion.a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
                  >
                    <ExternalLink size={18} /> Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
