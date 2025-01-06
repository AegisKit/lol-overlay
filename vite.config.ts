import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      injectRegister: "auto", //ここの記述
      manifest: {
        name: "おじさんゲーム",
        short_name: "おじさんゲーム",
        description: "おじさんゲーム",
        theme_color: "#ffffff",
        icons: [
          {
            src: "images/kawaida-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          // {
          //   src: "pwa-512x512.png",
          //   sizes: "512x512",
          //   type: "image/png",
          // },
          // {
          //   src: "pwa-512x512.png",
          //   sizes: "512x512",
          //   type: "image/png",
          //   purpose: "any",
          // },
          // {
          //   src: "pwa-512x512.png",
          //   sizes: "512x512",
          //   type: "image/png",
          //   purpose: "maskable",
          // },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
