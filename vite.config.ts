import { copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const vendor = (name: string, packages: string[]) => ({
  name,
  test: new RegExp(`node_modules[\\\\/](${packages.join('|')})[\\\\/]`),
});

const notFoundPage = (): Plugin => ({
  name: 'not-found-page',
  apply: 'build',
  writeBundle({ dir }) {
    if (!dir) return;
    copyFileSync(join(dir, 'index.html'), join(dir, '404.html'));
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), notFoundPage()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            vendor('react', ['react', 'react-dom', 'scheduler']),
            vendor('router', ['react-router']),
            vendor('lenis', ['lenis']),
          ],
        },
      },
    },
  },
});
