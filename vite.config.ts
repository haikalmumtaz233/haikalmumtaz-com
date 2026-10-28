import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['motion'],
          lenis: ['lenis', 'lenis/react'],
          router: ['react-router'],
        },
      },
    },
  },
})
