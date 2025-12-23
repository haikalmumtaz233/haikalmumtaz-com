import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactLenis } from '@studio-freight/react-lenis';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <App />
    </ReactLenis>
  </StrictMode>,
);
