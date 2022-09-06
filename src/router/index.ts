import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

// 后续将使用webpack将组件分组 /* webpackChunkName: "组名" */
export const constantRouterMap: Array<RouteRecordRaw> = [
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
  routes: constantRouterMap,
})
