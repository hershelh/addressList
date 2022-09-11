import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
  { path: '/', component: () => import('~/pages/index.vue') },
  {
    path: '/address/editAddress',
    name: 'editAddress',
    component: () => import('~/pages/addressManagement/editAddress.vue'),
  },
  {
    path: '/address/shipAddress',
    name: 'shipAddress',
    component: () => import('~/pages/addressManagement/shipAddress.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
