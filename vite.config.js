import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {
      BACKEND_URL: process.env.BACKEND_URL,
      SITE_URL: process.env.SITE_URL,
    },
  },
  base: '/',
  publicDir: 'public',
  server: {
    host: process.env.HOST,
    port: 8080,
    allowedHosts: [(new URL(process.env.SITE_URL)).host],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {},
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
