import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Apostolic-Faith-Botswana-/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
