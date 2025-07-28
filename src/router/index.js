import { createRouter, createWebHistory } from 'vue-router'

// Importation des pages
import Home from '../pages/Home.vue'
import Menu from '../pages/Menu.vue'
import NostraHistoria from '../pages/NostraHistoria.vue'
import MentionLegal from '../pages/MentionLegal.vue'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/menu_et_prestation',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/nostra_historia',
    name: 'NostraHistoria',
    component: NostraHistoria
  },
  {
    path: '/mention_legal',
    name: 'MentionLegal',
    component: MentionLegal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
scrollBehavior(to, from, savedPosition) {
  if (to.hash) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const el = document.querySelector(to.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
        resolve()
      }, 500)
    })
  }

  return { top: 0 }
}

})
export default router
