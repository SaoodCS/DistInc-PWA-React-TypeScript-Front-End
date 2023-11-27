/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { ServerOptions, defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const oneDayInSeconds = 86400;

// This configuration is used so that you can run the app locally with https and a trusted SSL certificate. This is needed so that you can:
// 1. develop and test browser caching locally
// 2. test FCM notifications locally
// - at the moment the mkcert certificate is available till Feb 2026

// To generate an SSL certificate using mkcert:
// 1. install mkcert by running 'choco install mkcert' in terminal
// 2. run 'mkcert -install' in terminal
// 3. run 'mkdir .cert' in terminal in the root of the project
// 4. run 'mkcert -key-file .\.cert\key.pem -cert-file .\.cert\cert.pem localhost' in terminal in the root of the project

// TODO: may have to consider disabling this in the production version of the app
// TODO: check if this would work on localnet 192... ip address
// TODO: write a guide on how to generate a certificate (as I've git ignored .cert folder)

const localHttpsServerConfig: ServerOptions = {
   https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
   },
};

export default defineConfig({
   server: localHttpsServerConfig,
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
            name: 'DistInc',
            short_name: 'DistInc',
            description: 'Distribute your income with ease',
            display: 'standalone',
            orientation: 'natural',
            start_url: '/?application=true',
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
