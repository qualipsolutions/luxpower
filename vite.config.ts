import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/luxpower/',
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    allowedHosts: [
      'localhost',
      'a351-105-245-114-175.ngrok-free.app',
    ],
  },
});
