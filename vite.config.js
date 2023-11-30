import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Cocobod Estate App",
        short_name: "CocobodEstate",
        description: "Estate management app for cocobod",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logo-cocobod.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        registerType: "autoUpdate",
      },
    }),
  ],
});
