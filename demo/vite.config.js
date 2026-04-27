import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
// import { VantResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver'
import { fileURLToPath, URL } from 'node:url'

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      'vue-shared-utils': resolvePath('../packages/vue-shared-utils/src/index.ts'),
      'vue-hooks-utils': resolvePath('../packages/vue-hooks-utils/src/index.ts'),
      'vue-modal-utils/style': resolvePath('../packages/vue-modal-utils/dist/vue-modal-utils.css'),
      'vue-modal-utils': resolvePath('../packages/vue-modal-utils/src/index.ts'),
    },
  },
})
