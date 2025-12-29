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
        target: "https://a9f76c9e150a.ngrok-free.app",
        changeOrigin: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
      "/images": {
        target: "https://a9f76c9e150a.ngrok-free.app",
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
