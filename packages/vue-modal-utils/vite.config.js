import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: false,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueModalUtils',
      fileName: (format) => {
        if (format === 'es') return 'vue-modal-utils.mjs'
        if (format === 'cjs') return 'vue-modal-utils.umd.cjs'
        return `vue-modal-utils.${format}.js`
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: (id) => id === 'vue' || id === 'vant' || id.startsWith('vant/'),
      output: {
        globals: {
          vue: 'Vue',
          vant: 'Vant',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
})
