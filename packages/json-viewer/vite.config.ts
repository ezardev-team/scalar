import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ScalarJsonViewer',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@scalar/components', '@scalar/use-codemirror'],
      output: {
        globals: {
          vue: 'Vue',
          '@scalar/components': 'ScalarComponents',
          '@scalar/use-codemirror': 'ScalarUseCodeMirror',
        },
      },
    },
  },
}) 