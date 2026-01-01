import { useLayoutEffect } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Background from './components/Background';

function App() {
  // Force scroll to top on every page load/refresh
  useLayoutEffect(() => {
    // Disable browser's native scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force immediate scroll to top before React renders
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <Background />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Home />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}

export default App;
