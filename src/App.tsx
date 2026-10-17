import { useLayoutEffect, useRef, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import type Lenis from 'lenis';
import MenuToggle from './components/MenuToggle';
import Footer from './components/Footer';
import Home from './pages/Home';
import Background from './components/Background';
import JourneyProvider from './journey/JourneyProvider';
import Intro from './components/Intro';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import TechIconSprite from './components/ui/TechIconSprite';
import ErrorBoundary from './components/ErrorBoundary';

const Projects = lazy(() => import('./pages/Projects'));
const NotFound = lazy(() => import('./pages/NotFound'));

const scrollPositions = new Map<string, number>();
const MAX_RESTORE_FRAMES = 30;

const restoreScroll = (lenis: Lenis | undefined, target: number, framesLeft = MAX_RESTORE_FRAMES) => {
  requestAnimationFrame(() => {
    lenis?.resize();
    window.scrollTo(0, target);
    lenis?.scrollTo(target, { immediate: true });
    if (Math.abs(window.scrollY - target) > 1 && framesLeft > 0) {
      restoreScroll(lenis, target, framesLeft - 1);
    }
  });
};

function ScrollManager() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const previousPathRef = useRef<string>(pathname);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const previousPath = previousPathRef.current;

    if (pathname !== previousPath) {
      if (pathname === '/projects' && previousPath === '/') {
        scrollPositions.set('/', lenis?.scroll || window.scrollY);
      }

      if (pathname === '/' && previousPath === '/projects') {
        const savedPosition = scrollPositions.get('/');
        if (savedPosition !== undefined) restoreScroll(lenis, savedPosition);
      } else if (pathname === '/projects') {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
      }

      previousPathRef.current = pathname;
    }
  }, [pathname, lenis]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();

  return (
    <JourneyProvider>
      <Intro />
      <TechIconSprite />
      <Background />
      <ScrollManager />
      <div className="min-h-screen flex flex-col">
        <MenuToggle />
        <main className="flex-grow">
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </JourneyProvider>
  );
}

function AppContent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <AppShell />;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <AppShell />
    </ReactLenis>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
