
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

  // Bundle React into the SSR output instead of leaving
  // unresolved external imports for Netlify.
  ssr: {
    noExternal: ["react", "react-dom"],
  },

  build: {
    rollupOptions: {
      output: isSsrBuild
        ? {
            entryFileNames: "entry-server.mjs",
          }
        : undefined,
    },
  },
}));
