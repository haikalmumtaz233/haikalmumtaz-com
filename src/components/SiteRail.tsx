import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { homeSections } from '../data/sections';
import { useActiveSection } from '../hooks/useActiveSection';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import MenuPanel, { MENU_PANEL_ID } from './MenuPanel';

const sectionIds = homeSections.map((section) => section.id);

const formatIndex = (value: number) => String(value).padStart(2, '0');

const SiteRail = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const activeId = useActiveSection(sectionIds, isHome);

  const { scrollYProgress } = useScroll();
  const progressScale = scrollYProgress;
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  const activeIndex = activeId ? sectionIds.indexOf(activeId) + 1 : 0;

  const goToSection = (id: string) => {
    if (!isHome) {
      navigate('/', { viewTransition: true });
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-rail-lg flex-col items-center justify-between border-r border-white/10 bg-black/30 backdrop-blur-md py-6">
        <motion.button
          type="button"
          onClick={() => navigate('/', { viewTransition: true })}
          style={{ opacity: prefersReducedMotion ? 1 : wordmarkOpacity }}
          className="font-monument text-[11px] font-black uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
          aria-label="Haikal Mumtaz, back to top"
        >
          <span style={{ writingMode: 'vertical-rl' }}>HAIKAL MUMTAZ</span>
        </motion.button>

        <nav aria-label="Sections" className="flex flex-col items-center gap-4">
          {homeSections.map((section, index) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => goToSection(section.id)}
                aria-current={isActive ? 'true' : undefined}
                title={section.label}
                className="group relative flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                    isActive ? 'text-purple-400' : 'text-white/35 group-hover:text-white/70'
                  }`}
                >
                  {formatIndex(index + 1)}
                </span>
                <span
                  className={`pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded bg-black/80 px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    isActive ? 'text-purple-300' : ''
                  }`}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] tabular-nums text-white/40">
            {formatIndex(activeIndex)}/{formatIndex(homeSections.length)}
          </span>

          <div className="relative h-24 w-px overflow-hidden bg-white/15">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-purple-500"
              style={{ scaleY: progressScale }}
            />
          </div>

          <div className="h-12 w-full" data-rail-slot="cv-and-language" />

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls={MENU_PANEL_ID}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/70 backdrop-blur-md">
        <div className="relative h-px w-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-purple-500"
            style={{ scaleX: progressScale }}
          />
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/', { viewTransition: true })}
            className="font-monument text-[10px] font-black uppercase tracking-[0.25em] text-white/80"
            aria-label="Haikal Mumtaz, back to top"
          >
            HAIKAL MUMTAZ
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tabular-nums text-white/40">
              {formatIndex(activeIndex)}/{formatIndex(homeSections.length)}
            </span>

            <div className="h-8" data-rail-slot="cv-and-language" />

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls={MENU_PANEL_ID}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
          className="fixed top-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <MenuPanel isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default SiteRail;
