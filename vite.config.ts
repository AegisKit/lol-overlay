import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/asia": {
        target: "https://asia.api.riotgames.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asia/, ""),
      },
      "/jp1": {
        target: "https://jp1.api.riotgames.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jp1/, ""),
      },
      "/opgg": {
        target: "https://www.op.gg",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opgg/, ""),
      },
    },
  },
});
