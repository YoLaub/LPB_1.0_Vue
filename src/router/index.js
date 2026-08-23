import { createRouter, createWebHistory } from 'vue-router'

// Importation des pages
import Home from '../pages/Home.vue'
import Menu from '../pages/Menu.vue'
import NostraHistoria from '../pages/NostraHistoria.vue'
import MentionLegal from '../pages/MentionLegal.vue'
import { setLangFromRoute } from '../composables/useLang.js'



// ES (langue par défaut, cible prioritaire Argentine/Uruguay) reste non
// préfixée : /menu_et_prestation. Les 3 autres langues sont préfixées :
// /en/menu_et_prestation, /fr/..., /pg/... — le paramètre :lang est
// optionnel et restreint à ces 3 codes, donc absent pour ES.
const routes = [
  {
    path: '/:lang(en|fr|pg)?',
    name: 'Home',
    component: Home
  },
  {
    path: '/:lang(en|fr|pg)?/menu_et_prestation',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/:lang(en|fr|pg)?/nostra_historia',
    name: 'NostraHistoria',
    component: NostraHistoria
  },
  {
    path: '/:lang(en|fr|pg)?/mention_legal',
    name: 'MentionLegal',
    component: MentionLegal
  },
  // /es/... n'est jamais l'URL canonique (ES est non préfixée) — on redirige
  // plutôt que de laisser une page blanche si quelqu'un devine cette URL.
  { path: '/es', redirect: '/' },
  { path: '/es/menu_et_prestation', redirect: '/menu_et_prestation' },
  { path: '/es/nostra_historia', redirect: '/nostra_historia' },
  { path: '/es/mention_legal', redirect: '/mention_legal' },
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

// L'URL est la seule source de vérité pour la langue affichée (voir
// composables/useLang.js) — synchronisée à chaque navigation.
router.beforeEach((to) => {
  setLangFromRoute(to.params.lang)
})

export default router
