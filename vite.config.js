import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    allowedHosts: ['care-systems.onrender.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'mui-vendor';
            }
            if (id.includes('recharts') || id.includes('chart.js')) {
              return 'chart-vendor';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('lodash')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
