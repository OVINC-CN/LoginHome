import * as vueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/spirit/',
    name: 'Spirit',
    component: () => import('@/views/Spirit.vue'),
  },
  {
    path: '/services/',
    name: 'Services',
    component: () => import('@/views/Services.vue'),
  },
  {
    path: '/reset-password/',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
  },
  {
    path: '/agreement/:type/',
    name: 'Agreement',
    component: () => import('@/views/Agreement.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: () => import('@/views/Error404.vue'),
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes,
});

export default router;
