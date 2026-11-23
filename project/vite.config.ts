
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
        "process.env": "{}",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
        }),
      ],
    },
  },

  build: {
    rollupOptions: {
      external: isSsrBuild
        ? ["react", "react-dom", "react-dom/server"]
        : [],
      output: isSsrBuild
        ? {
            entryFileNames: "entry-server.mjs",
          }
        : undefined,
    },
  },
}));
