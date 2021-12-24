import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import styleImport from 'vite-plugin-style-import'

export default defineConfig({
  server: {
    port: 8990,
    host: '0.0.0.0',
    open: true
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: "build",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    react(), 
    styleImport({
      resolves: [() => {

      }]
    })
  ]
})
