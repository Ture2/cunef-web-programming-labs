import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy: /api/* → http://localhost:3000/* (avoids CORS; no backend change needed).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
