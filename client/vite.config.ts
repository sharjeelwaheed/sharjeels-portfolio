import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { compression } from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [react(), compression()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('node_modules/axios') || id.includes('node_modules/react-hot-toast')) return 'utils'
        },
      },
    },
  },
})
