/* eslint-disable no-useless-escape */
/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import fs from 'fs';
import type { ServerOptions } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const oneDayInSeconds = 86400;

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), '');
   const runningVar = env.VITE_RUNNING as 'locally' | 'deployed';
   const isRunningLocally = runningVar === 'locally';
   const localUrlPattern = /^https?.*/;
   const deployedUrlPattern = /^https?:\/\/[^\/]+\/apiGateway\/gatewayRequestGet\?.+$/;
   const urlPattern = isRunningLocally ? localUrlPattern : deployedUrlPattern;
   const server = (): ServerOptions | undefined => {
      if (isRunningLocally) {
         return {
            https: {
               key: fs.readFileSync('./.cert/key.pem'),
               cert: fs.readFileSync('./.cert/cert.pem'),
            },
         };
      }
      return undefined;
   };

   return {
      server: server(),
      plugins: [
         react(),
         VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
               enabled: true,
            },
            workbox: {
               disableDevLogs: true,
               cleanupOutdatedCaches: true,
               skipWaiting: true,
               clientsClaim: true,
               runtimeCaching: [
                  {
                     urlPattern: urlPattern,
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
   };
});

// --- LOCAL HTTPS SERVER CONFIG --- //
// The localHttpsServerConfig is used so that you can run the app locally with https and a trusted SSL certificate. This is needed so that you can:
// - Develop and test browser caching locally
// - Test FCM notifications locally

// How to generate an SSL certificate using mkcert:
// 1. install mkcert by running 'choco install mkcert' in terminal (if not already installed)
// 2. run 'mkcert -install' in terminal (if not already installed)
// 3. delete the .cert file in the root of the project (if it exists)
// 4. run 'mkdir .cert' in terminal in the root of the project
// 5. run 'mkcert -key-file .\.cert\key.pem -cert-file .\.cert\cert.pem localhost 192.168.1.80' in terminal in the root of the project (this generates a certificate for localhost and your local IP address (so is setup to only work locally which is what we want))
// 6. Note down when the certificate in available till above the localHttpsServerConfig const (in this case it's Feb 2026)
// --- When the certificate expires, run steps 3 and 4 again to generate a new certificate
