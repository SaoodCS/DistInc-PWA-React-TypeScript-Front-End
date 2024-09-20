/* eslint-disable no-useless-escape */
/// <reference types="vitest" />
/// <reference types="vite/client" />
import react from '@vitejs/plugin-react';
import fs from 'fs';
import type { ESBuildOptions, ServerOptions } from 'vite';
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

   const buildOptions = (): ESBuildOptions => {
      if (!mode.includes('dev')) {
         return {
            drop: ['console', 'debugger'],
         };
      }
      return {};
   };

   return {
      server: server(),
      esbuild: buildOptions(),
      test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setupTests.ts'] },
      plugins: [
         react(),
         VitePWA({
            registerType: 'autoUpdate',
            devOptions: { enabled: true },
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
               categories: ['finance', 'lifestyle', 'personalization', 'productivity', 'utilities'],
               display: 'standalone',
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
               screenshots: [
                  // https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
               ],
            },
         }),
      ],
   };
});
