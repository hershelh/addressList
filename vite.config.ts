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
    Vue(),

    Pages({
      dirs: 'src/views',
      exclude: ['**/components/*.vue'],
      onRoutesGenerated(routes) {
        routes.push({ path: '/address', redirect: '/address/shipAddress' })
      },
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vue-router': ['createRouter', 'createWebHistory'],
          'axios': [
            ['default', 'axios'],
          ],
          '@testing-library/vue': [
            'fireEvent',
            'render',
            'waitFor',
            'screen',
          ],
          '@pinia/testing': ['createTestingPinia'],
          'vant': ['Toast', 'Dialog'],
        },
      ],
      dirs: [
        './src/network/**',
        './src/stores/**',
        './src/utils/**',
      ],
      vueTemplate: true,
    }),

    Components({
      resolvers: [VantResolver()],
      dirs: ['src/components', 'src/views'],
      include: [/\.vue$/, /\.vue\?vue/],
    }),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vant'],
    },
    setupFiles: path.resolve(__dirname, 'test/vitest-setup'),
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/network/**'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
})
