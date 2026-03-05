import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    extensions: ['.js', '.json'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueSharedUtils',
      fileName: (format) => {
        if (format === 'es') return 'vue-shared-utils.mjs'
        if (format === 'cjs') return 'vue-shared-utils.umd.cjs'
        return `vue-shared-utils.${format}.js`
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => id === 'vue',
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})
