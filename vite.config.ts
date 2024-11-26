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
    rollupOptions: {
      external: [],
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': [
            '@tanstack/react-query', 
            'react-hot-toast', 
            'framer-motion', 
            'react-icons', 
            'recharts', 
            'react-countup', 
            'react-intersection-observer',
            'react-paginate',
            'react-hook-form'
          ],
          'utils-vendor': ['date-fns']
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
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
