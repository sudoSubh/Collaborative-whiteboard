import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations - simplified for better compatibility
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('socket.io-client')) {
              return 'socket';
            }
            if (id.includes('lucide-react')) {
              return 'ui';
            }
            return 'vendor';
          }
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  server: {
    // Development server configuration
    host: true,
    port: 5173
  },
  preview: {
    // Preview server configuration
    host: true,
    port: 4173
  }
})
