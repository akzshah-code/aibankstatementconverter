

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// FIX: In an ES module context, __dirname is not available. This is required to recreate it.
import { fileURLToPath } from 'url'

// FIX: Recreate __dirname for ES module scope.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    strictPort: true, // Exit if port is already in use
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create a separate chunk for the exceljs library to isolate its size.
          if (id.includes('exceljs')) {
            return 'vendor-exceljs';
          }
          // Group React-related libraries into a single chunk for better caching.
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});