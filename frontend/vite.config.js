import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Remove manualChunks - not compatible with rolldown-vite
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok.app',
      '.vercel.app'
    ],
    hmr: {
      clientPort: 443,
      protocol: 'wss'
    }
  }
})