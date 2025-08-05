import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // root directory where index.html lives
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html', // explicitly point to index.html
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'pdf-lib']
        }
      }
    }
  }
})
