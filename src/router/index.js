import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/room-archive'
  },
  {
    path: '/room-archive',
    name: 'RoomArchive',
    component: () => import('@/views/RoomArchive.vue'),
    meta: { title: '房间档案', icon: 'House' }
  },
  {
    path: '/inspection',
    name: 'Inspection',
    component: () => import('@/views/Inspection.vue'),
    meta: { title: '验房清单', icon: 'List' }
  },
  {
    path: '/photos',
    name: 'Photos',
    component: () => import('@/views/Photos.vue'),
    meta: { title: '照片取证', icon: 'Picture' }
  },
  {
    path: '/fees',
    name: 'Fees',
    component: () => import('@/views/Fees.vue'),
    meta: { title: '费用核算', icon: 'Money' }
  },
  {
    path: '/handover',
    name: 'Handover',
    component: () => import('@/views/Handover.vue'),
    meta: { title: '交接单', icon: 'Document' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
