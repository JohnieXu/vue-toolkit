import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueHooksUtils',
      fileName: (format) => {
        if (format === 'es') return 'vue-hooks-utils.mjs'
        if (format === 'cjs') return 'vue-hooks-utils.umd.cjs'
        return `vue-hooks-utils.${format}.js`
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
