
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html', 
    },
  },
<<<<<<< HEAD
})
=======
})
>>>>>>> a344fc05a0de9bbe9f6d6ae72bf81a8e2281c6f9
