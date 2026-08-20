import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The proxy rewrites /api/* → http://localhost:3000/* so the frontend
// never sees CORS errors when the Block II backend runs on :3000.
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
