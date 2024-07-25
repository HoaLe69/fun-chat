import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ svgrOptions: {} })],
  server: {
    watch: {
      ignored: ['node_modules', '**/*.test.tsx', '**/*.test.ts'],
    },
    host: true,
    port: 5173,
  },
})
