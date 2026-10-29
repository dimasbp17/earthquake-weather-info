import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bmkgAlertsHandler from './api/bmkg-alerts.js'

// Jalankan handler /api/bmkg-alerts yang sama dengan produksi (Vercel) saat dev & preview.
const bmkgAlertsProxy = () => {
  const middleware = (req, res, next) => {
    if (req.url.startsWith('/api/bmkg-alerts')) return bmkgAlertsHandler(req, res)
    next()
  }
  return {
    name: 'bmkg-alerts-proxy',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), bmkgAlertsProxy()],
})
