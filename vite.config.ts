import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // target: "https://d34d64e4bca8.ngrok-free.app",
        target: "http://localhost:9092",
        changeOrigin: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
      "/images": {
        // target: " https://d34d64e4bca8.ngrok-free.app",
        target: "http://localhost:9092",
        changeOrigin: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
