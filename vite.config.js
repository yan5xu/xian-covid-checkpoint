import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import styleImport from 'vite-plugin-style-import'

export default defineConfig({
  server: {
    port: 8990,
    host: '0.0.0.0',
    open: true
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
      libs: [
        {
          libraryName: 'zarm',
          esModule: true,
          resolveStyle: (name) => {
            return `zarm/es/${name}/style/index`
          },
        },
      ],
    })
  ]
})
