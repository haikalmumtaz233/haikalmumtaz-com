import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const vendor = (name: string, packages: string[]) => ({
  name,
  test: new RegExp(`node_modules[\\\\/](${packages.join('|')})[\\\\/]`),
})

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            vendor('react', ['react', 'react-dom', 'scheduler']),
            vendor('motion', ['motion', 'framer-motion', 'motion-dom', 'motion-utils']),
            vendor('router', ['react-router']),
            vendor('lenis', ['lenis']),
          ],
        },
      },
    },
  },
})
