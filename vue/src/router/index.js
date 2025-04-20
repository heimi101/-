import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },
  {
    path: '/ticket',
    name: 'Ticket',
    component: () => import('@/views/Ticket.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta: { requiresAuth: true },
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    meta: { requiresAuth: true },
    component: () => import('../views/Orders.vue')
  },
  {
    path: '/favorites',
    name: 'Favorites',
    meta: { requiresAuth: true },
    component: () => import('../views/Favorites.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('token') // 实际项目中根据具体登录状态判断
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    // 如果需要登录但未登录，跳转到首页并显示登录框
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
