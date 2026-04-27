import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['packages/*/src/**/*.{test,spec}.ts'],
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      'vue-shared-utils': resolvePath('./packages/vue-shared-utils/src/index.ts'),
      'vue-hooks-utils': resolvePath('./packages/vue-hooks-utils/src/index.ts'),
      'vue-modal-utils': resolvePath('./packages/vue-modal-utils/src/index.ts'),
    },
  },
})
