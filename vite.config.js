import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 조건문 제거하고 강력하게 지정
  base: "/CapstoneDesign2-FE/",
  server: {
    proxy: {
      "/api": {
        target: "https://econutriscore-backend.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
