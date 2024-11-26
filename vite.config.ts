import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-router-dom',
      'react',
      'react-dom',
      '@tanstack/react-query',
      'react-hot-toast',
      'framer-motion',
      'react-icons',
      'recharts',
      'react-countup',
      'react-intersection-observer',
      'react-paginate',
      'date-fns',
      'react-hook-form'
    ],
    exclude: []
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      external: [],
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks(id) {
          // Core React chunks
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // Routing chunks
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router-vendor';
          }

          // UI Framework chunks
          if (id.includes('node_modules/@tanstack/react-query/') ||
              id.includes('node_modules/react-hot-toast/') ||
              id.includes('node_modules/framer-motion/')) {
            return 'ui-core-vendor';
          }

          // UI Component chunks
          if (id.includes('node_modules/react-icons/') ||
              id.includes('node_modules/recharts/') ||
              id.includes('node_modules/react-countup/') ||
              id.includes('node_modules/react-intersection-observer/') ||
              id.includes('node_modules/react-paginate/') ||
              id.includes('node_modules/react-hook-form/')) {
            return 'ui-components-vendor';
          }

          // Utility chunks
          if (id.includes('node_modules/date-fns/')) {
            return 'utils-vendor';
          }

          // Dynamic imports for route-based code splitting
          if (id.includes('/src/pages/')) {
            return 'pages';
          }

          if (id.includes('/src/components/')) {
            return 'components';
          }
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
