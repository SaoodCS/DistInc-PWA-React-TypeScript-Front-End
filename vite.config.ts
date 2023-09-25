/// <reference types="vitest" />
/// <reference types="vite/client" />
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const oneDayInSeconds = 86400;

const localHttpsForTestingFCM = {
   server: {
      https: true,
   },
   sslPlugin: basicSsl(),
};

export default defineConfig({
   server: localHttpsForTestingFCM.server,
   plugins: [
      localHttpsForTestingFCM.sslPlugin,
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
            name: 'DistInc',
            short_name: 'DistInc',
            description: 'Distribute your income with ease',
            display: 'standalone',
            orientation: 'natural',
            start_url: '/?application=true',
            id: '/?application=true',
            scope: '/',
            icons: [
               {
                  src: '/icons/logo-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                  purpose: 'any',
               },
               {
                  src: '/icons/logo-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                  purpose: 'maskable',
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
