import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/CapstoneDesign2-FE/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://econutriscore-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
}))
