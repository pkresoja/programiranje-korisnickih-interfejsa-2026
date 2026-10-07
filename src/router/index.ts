import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DetailsView from '@/views/DetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import UserView from '@/views/UserView.vue'
import OrderView from '@/views/OrderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/about',
      component: AboutView,
      meta: {
        title: 'About'
      }
    },
    {
      path: '/details/:id',
      component: DetailsView,
      meta: {
        title: 'Details'
      }
    },
    {
      path: '/login',
      component: LoginView,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/user',
      component: UserView,
      meta: {
        title: 'Account'
      }
    },
    {
      path: '/order/:id',
      component: OrderView,
      meta: {
        title: 'New Order'
      }
    }
  ],
})

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} :: PKI 2026`
  }
})

export default router
