
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
  noExternal: [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom",
    "@remix-run/router",
    "@swc/helpers",

    "axios",
    "form-data",
    "combined-stream",
    "delayed-stream",
    "mime-types",
    "mime-db",
    "asynckit",
    "follow-redirects",
    "proxy-from-env",
    "https-proxy-agent",
    "es-set-tostringtag",
    "hasown",

    "jwt-decode",
    "lucide-react",
    "react-icons",
    "scheduler",
    "next",

    "agent-base",
    "debug",
    "es-errors",
    "function-bind",
    "get-intrinsic",
    "has-tostringtag",
  ],
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
