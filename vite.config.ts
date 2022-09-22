/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
    conditions: process.env.VITEST ? ['node'] : [],
  },

  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    Pages({
      dirs: 'src/pages',
    }),

    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: true,
      dirs: [
        './src/composables',
        './src/store/**',
      ],
      vueTemplate: true,
    }),

    Components({
      resolvers: [VantResolver()],
      dirs: ['src/components', 'src/pages'],
      dts: true,
    }),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vant'],
    },
    setupFiles: `${path.resolve(__dirname, 'test/vitest-setup.ts')}/`,
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/api/**', 'src/network/**', 'src/router/**'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
})
