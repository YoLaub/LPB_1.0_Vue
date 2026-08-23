import { ref, watch } from 'vue'
import { resolveLang } from '../lib/i18n.js'

const STORAGE_KEY = 'lpb-lang'

// Code BCP47 pour l'attribut lang du document ("PG" -> code de dossier interne
// pour le portugais, mais "pt" est le code de langue standard à exposer)
const HTML_LANG = { ES: 'es', EN: 'en', FR: 'fr', PG: 'pt' }

// L'URL est la source de vérité (ES non préfixée, EN/FR/PG préfixées — voir
// lib/i18n.js). On ne redirige jamais selon la langue détectée du navigateur
// ou mémorisée : Google déconseille de servir un contenu différent sur la
// même URL selon le visiteur (proche du cloaking), et ça casserait le
// hreflang qu'on vient d'ajouter.
const currentLang = ref(resolveLang(undefined))

function syncDocumentLang(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = HTML_LANG[lang] || 'es'
  }
}

syncDocumentLang(currentLang.value)

watch(currentLang, (lang) => {
  syncDocumentLang(lang)
  try {
    // Mémorisé pour un usage futur (ex. bannière "continuer en français ?"),
    // ne pilote plus la langue affichée aujourd'hui.
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // localStorage indisponible : le choix ne sera simplement pas mémorisé
  }
})

// Appelé par le routeur à chaque navigation (voir router/index.js) : c'est
// le seul point qui doit faire varier currentLang.
export function setLangFromRoute(routeParamLang) {
  currentLang.value = resolveLang(routeParamLang)
}

export function useLang() {
  return {
    currentLang
  }
}
