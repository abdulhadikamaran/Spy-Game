/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

// Take control immediately  
self.skipWaiting();
clientsClaim();

// Clean old caches from previous SW versions
cleanupOutdatedCaches();

// Pre-cache all assets that vite-plugin-pwa injects here at build time
// The __WB_MANIFEST placeholder is replaced with the actual list of files
precacheAndRoute(self.__WB_MANIFEST);
