import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'ChamiNext Practice',
        short_name: 'ChamiNext',
        description: '10–20 min daily AI-era engineering practice',
        theme_color: '#3b82f6',
        background_color: '#0a0a0f',
        display: 'standalone',
        start_url: '/daily',
        icons: [
          { src: '/favicon.ico', sizes: '64x64', type: 'image/x-icon' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/content\/.*\.json$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'content-cache', expiration: { maxEntries: 32 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
