import { defineConfig } from 'vite'
import { resolve } from "path"
import react from '@vitejs/plugin-react'
import styleImport from 'vite-plugin-style-import'
import { viteVConsole } from 'vite-plugin-vconsole';

export default defineConfig({
  server: {
    port: 3000,
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
    viteVConsole({
      entry: resolve('src/index.jsx'),
      localEnabled: true,
      enabled: true,
      config: {
        maxLogNumber: 1000,
        theme: 'dark'
      }
    }),
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
