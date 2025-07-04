// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/checklist-frotas-sas/', // nome do repositório com barra no início e fim
  plugins: [react()],
})
