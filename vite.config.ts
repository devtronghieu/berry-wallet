import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@engine": path.resolve(__dirname, "./src/engine"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@messaging": path.resolve(__dirname, "./src/messaging"),
      "@screens": path.resolve(__dirname, "./src/screens"),
      "@state": path.resolve(__dirname, "./src/state"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ["buffer", "stream", "crypto"],
      globals: {
        Buffer: true,
      },
    }),
  ],
});
