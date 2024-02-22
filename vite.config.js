import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //   // By default, Vite doesn't include shims for NodeJS/
  //   // necessary for segment analytics lib to work
  //   global: {},
  // },
  plugins: [
    svgr(),
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // runtimeCaching: [
        //   {
        //     urlPattern: ({ url }) => {
        //       return url.pathname.startsWith("/api") && !url.pathname.includes('user');
        //     },
        //     handler: "CacheFirst",
        //     options: {
        //       cacheName: "api-cache",
        //       cacheableResponse: {
        //         statuses: [0, 200],
        //       },
        //     },
        //   },
        // ],
      },
      includeAssets: ['apple-touch-icon-180x180.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Cocobod Estate App',
        short_name: 'CocobodEstate',
        description: 'Estate management app for cocobod',
        theme_color: '#6E431D',
        icons: [
          {
            src: 'pwa-192x192.png', // <== don't add slash, for testing
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png', // <== don't remove slash, for testing
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // <== don't add slash, for testing
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any ',
          },
        ],
      },
    }),
  ],
});
