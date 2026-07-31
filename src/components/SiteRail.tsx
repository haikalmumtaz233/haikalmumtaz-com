import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { homeSections } from '../data/sections';
import { useActiveSection } from '../hooks/useActiveSection';
import { useJourney } from '../journey/useJourney';
import MenuPanel, { MENU_PANEL_ID } from './MenuPanel';

const sectionIds = homeSections.map((section) => section.id);

const HERO_SECTION_ID = 'hero';

const formatIndex = (value: number) => String(value).padStart(2, '0');

const SiteRail = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const activeId = useActiveSection(sectionIds, isHome);

  const { progress } = useJourney();
  const progressScale = progress;

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
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/70 backdrop-blur-md">
        <div className="relative h-px w-full bg-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left bg-purple-500"
            style={{ scaleX: progressScale }}
          />
        </div>

        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => goToSection(HERO_SECTION_ID)}
            className="font-monument text-[10px] font-black uppercase tracking-[0.25em] text-white/80 transition-colors hover:text-white"
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
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
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
