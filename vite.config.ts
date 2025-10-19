import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import htmlEnv from 'vite-plugin-html-env';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MakeLucky/',
  plugins: [
    react(),
    htmlEnv()
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
