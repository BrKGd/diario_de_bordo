import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // IMPORTANTE para GitHub Pages
  base: '/diario_de_bordo/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})