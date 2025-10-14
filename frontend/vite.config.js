import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build for production
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios'],
        }
      }
    }
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