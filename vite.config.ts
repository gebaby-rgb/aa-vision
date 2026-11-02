import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base: the build works on any host or sub-path (GitHub Pages, Netlify, ...)
  base: './',
  plugins: [react()],
})
