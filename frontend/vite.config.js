import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies /api and /uploads to the Spring Boot backend on
// port 8080, so the browser sees everything as same-origin during
// development and the session cookie behaves normally.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
