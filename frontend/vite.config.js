import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },
  server:{
    proxy: {
      "/api": {
        target: "http://localhost:5173" ,
      },
      "/auth": {
        target: "http://localhost:5173" ,
      }
      ,
      "/cart": {
        target: "http://localhost:5173" ,
      }
    }
  }
})
