import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/I-lo/', // هذا السطر يحل مشكلة الصفحة البيضاء
})
