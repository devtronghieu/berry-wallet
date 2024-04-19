import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@screens": path.resolve(__dirname, "./src/screens"),
            "@state": path.resolve(__dirname, "./src/state"),
        },
    },
    plugins: [react()],
});
