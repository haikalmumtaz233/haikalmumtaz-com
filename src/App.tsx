import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Achievements from './pages/Achievements';
import Hobbies from './pages/Hobbies';

/* === LAYOUT === */
const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2600);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoading && <Navbar />}
      <main className="flex-grow">
        <Outlet context={{ isLoading, setIsLoading }} />
      </main>
      {!isLoading && <Footer />}
    </div>
  );
};

/* === APP === */
function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="hobbies" element={<Hobbies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}

export default App;
