import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      // Provide browser-compatible versions or empty modules for Node.js built-ins
      events: 'events',
      buffer: 'buffer',
      util: 'util',
      stream: 'stream-browserify',
      path: 'path-browserify',
      url: 'url',
      http: 'stream-http',
      https: 'https-browserify',
    },
  },
  optimizeDeps: {
    exclude: ['express'], // Exclude express from client-side bundling
  },
});
