/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const oneDayInSeconds = 86400;

export default defineConfig({
   plugins: [
      react(),
      VitePWA({
         registerType: 'autoUpdate',
         devOptions: {
            enabled: true,
         },
         workbox: {
            cleanupOutdatedCaches: true,
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
               {
                  urlPattern: /^https?.*/,
                  handler: 'NetworkFirst',
                  method: 'GET',
                  options: {
                     cacheName: 'sw-fetch-cache',
                     expiration: {
                        maxEntries: 500,
                        maxAgeSeconds: oneDayInSeconds,
                     },
                     cacheableResponse: {
                        statuses: [0, 200],
                     },
                     matchOptions: {
                        ignoreSearch: false,
                     },
                  },
               },
            ],
         },
         manifest: {
            name: 'React Vite PWA',
            short_name: 'React Vite PWA',
            description: 'A React Vite PWA project',
            display: 'standalone',
            orientation: 'natural',
            start_url: '/?application=true',
            theme_color: '#000000',
            scope: '/',
            icons: [
               {
                  src: '/icons/logo-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any maskable',
               },
               {
                  src: '/icons/logo-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'any maskable',
               },
            ],
         },
      }),
   ],
   test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
   },
});
