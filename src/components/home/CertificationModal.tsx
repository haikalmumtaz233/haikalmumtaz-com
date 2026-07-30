import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { useLenis } from 'lenis/react';
import type { Certification } from '../../data/certifications';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { revealEase } from '../../lib/motion';

interface CertificationModalProps {
  cert: Certification | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificationModal = ({ cert, isOpen, onClose }: CertificationModalProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [isOpen, handleKeyDown, lenis]);

  const isOfficialLink =
    cert?.credentialLink &&
    !cert.credentialLink.includes('drive.google.com');

  return createPortal(
    <AnimatePresence>
      {isOpen && cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden"
          onClick={onClose}
          onWheel={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: prefersReducedMotion ? 1 : 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: prefersReducedMotion ? 1 : 0.92, opacity: 0 }}
            transition={{ duration: 0.3, ease: revealEase }}
            className="relative max-w-4xl w-full h-auto max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex-1 flex items-center justify-center p-4 pt-14 overflow-hidden">
              <img
                src={cert.image}
                alt={`${cert.title} certificate from ${cert.issuer}`}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>

            <div className="p-5 md:p-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h3 className="text-lg font-bold text-white leading-tight">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  {cert.issuer} · {cert.date}
                </p>
              </div>

              {isOfficialLink && (
                <a
                  href={cert.credentialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-white/10 border border-white/20 px-4 py-2.5 rounded-lg hover:bg-white/20 hover:border-white/40 transition-colors"
                >
                  <span>Verify Credential</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CertificationModal;
