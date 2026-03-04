import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'vue-toolkit' },
  },
  {
    path: '/vue-modal-utils',
    name: 'vue-modal-utils',
    component: () => import('../views/vue-modal-utils/Index.vue'),
    meta: { title: 'vue-modal-utils' },
  },
  {
    path: '/vue-modal-utils/phase1',
    name: 'vue-modal-utils-phase1',
    component: () => import('../views/vue-modal-utils/Phase1.vue'),
    meta: { title: 'showCommonBottomPopup' },
  },
  {
    path: '/vue-modal-utils/phase2',
    name: 'vue-modal-utils-phase2',
    component: () => import('../views/vue-modal-utils/Phase2.vue'),
    meta: { title: 'showModal 基础版' },
  },
  {
    path: '/vue-modal-utils/phase3',
    name: 'vue-modal-utils-phase3',
    component: () => import('../views/vue-modal-utils/Phase3.vue'),
    meta: { title: 'showModal 全量' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
