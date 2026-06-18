import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  base: '/', // Ensure proper base path for deployment
  build: {
    outDir: 'dist', // Explicit output directory
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
