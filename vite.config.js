import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Agent requests go to the small Node server (npm run server).
  server: { proxy: { '/api': 'http://localhost:8791' } },
})
