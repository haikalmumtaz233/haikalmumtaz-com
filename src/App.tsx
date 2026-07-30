import { useLayoutEffect, useRef, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Background from './components/Background';

const Projects = lazy(() => import('./pages/Projects'));
const NotFound = lazy(() => import('./pages/NotFound'));
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import TechIconSprite from './components/ui/TechIconSprite';

const scrollPositions = new Map<string, number>();

function ScrollManager() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
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
        if (savedPosition !== undefined && navigationType === 'POP') {
          requestAnimationFrame(() => {
            window.scrollTo(0, savedPosition);
            lenis?.scrollTo(savedPosition, { immediate: true });
          });
        } else if (savedPosition !== undefined) {
          requestAnimationFrame(() => {
            window.scrollTo(0, savedPosition);
            lenis?.scrollTo(savedPosition, { immediate: true });
          });
        }
      } else if (pathname === '/projects') {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
      }

      previousPathRef.current = pathname;
    }
  }, [pathname, lenis, navigationType]);

  return null;
}

function AppShell() {
  return (
    <>
      <TechIconSprite />
      <Background />
      <ScrollManager />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
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
