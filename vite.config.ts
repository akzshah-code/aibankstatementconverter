import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              // Group large libraries into separate chunks for better caching.
              if (id.includes('pdf-lib')) {
                return 'vendor-pdf-lib';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              // All other node_modules will be grouped into a general vendor chunk.
              return 'vendor';
            }
          }
        }
      }
    },
  }
})
