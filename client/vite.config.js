// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite"; // ← Add this

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(), // ← Add this
//   ],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:5000",
//         changeOrigin: true,
//       },
//     },
//   },
//   build: {
//     outDir: "dist",
//     sourcemap: false,
//     minify: "esbuild",
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ["react", "react-dom"],
//           router: ["react-router-dom"],
//           ui: ["lucide-react", "react-hot-toast"],
//           state: ["zustand"],
//           forms: ["react-hook-form", "@hookform/resolvers", "zod"],
//         },
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",

    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react", "react-hot-toast"],
          state: ["zustand"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },
});
