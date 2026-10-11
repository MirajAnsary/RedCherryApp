//user-frontend
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy /api requests from the frontend dev server to the backend.
    // This means you call fetch("/api/auth/register") in React and Vite
    // forwards it to http://localhost:5000/api/auth/register — no CORS issues.
    proxy: {
      // Host routes + live socket are served by host-backend (port 5001).
      // Must come before "/api" — the first matching key wins.
      "/api/host": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:5001",
        ws: true,
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/host-uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
