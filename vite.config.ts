import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
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
    ],
    exclude: ['@prisma/client']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-icons', 'recharts']
        }
      },
      external: ['@prisma/client']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '.prisma/client/index-browser': '@prisma/client'
    }
  }
});
