import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', //target host (may need to be http://127.0.0.1:8000)
        changeOrigin: true,   // needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '') // Rewrite the path: remove '/api' before sending the request
      }
    }
  }

})