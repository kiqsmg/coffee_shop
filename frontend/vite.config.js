import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 5001 (a 5000 e usada pelo AirPlay Receiver no macOS)
      '/api': 'http://localhost:5001',
    },
  },
})
