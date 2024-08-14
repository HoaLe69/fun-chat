import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({ svgrOptions: {} }), tsconfigPaths()],
  server: {
    watch: {
      ignored: ['node_modules', '**/*.test.tsx', '**/*.test.ts'],
    },
    host: true,
    port: 5173,
  },
})
