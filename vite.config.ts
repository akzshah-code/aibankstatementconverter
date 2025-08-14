import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig(() => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Creates a separate chunk for each of the large vendor libraries.
            // This improves caching and initial load times.
            if (id.includes('node_modules')) {
              if (id.includes('pdf-lib')) {
                return 'vendor-pdf-lib';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-google-genai';
              }
              if (id.includes('react-dom')) {
                return 'vendor-react-dom';
              }
            }
          },
        },
      },
    },
  }
})