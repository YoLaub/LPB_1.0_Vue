// Logique pure de routage multilingue : aucune dépendance à Vue/Vue Router,
// pour rester testable sans monter de composant. L'espagnol (ES) est la
// langue d'origine du site, ciblant en priorité l'Argentine/l'Uruguay — il
// reste donc non préfixé (URLs déjà indexées inchangées) ; les 3 autres
// langues sont préfixées (/en, /fr, /pg).

export const DEFAULT_LANG = 'ES'
export const SUPPORTED_LANGS = ['ES', 'EN', 'FR', 'PG']

// Code hreflang (BCP47) exposé à Google pour chaque langue interne.
// "PG" est le nom de dossier interne historique (public/data/PG/) pour le
// portugais, mais le code de langue standard à annoncer est "pt".
export const HREFLANG_CODES = { ES: 'es', EN: 'en', FR: 'fr', PG: 'pt' }

export const ROUTE_BASE_PATHS = {
  Home: '/',
  Menu: '/menu_et_prestation',
  NostraHistoria: '/nostra_historia',
  MentionLegal: '/mention_legal',
}

export const SITE_ORIGIN = 'https://www.la-petite-bretagne.com'

// `routeParamLang` : valeur de route.params.lang (undefined pour ES, sinon
// "en"/"fr"/"pg" fournis en minuscule par la regex de route Vue Router).
export function resolveLang(routeParamLang) {
  const code = (routeParamLang || '').toUpperCase()
  return SUPPORTED_LANGS.includes(code) ? code : DEFAULT_LANG
}

// basePath : chemin non préfixé ("/", "/menu_et_prestation", ...).
export function localizedPath(basePath, langCode) {
  if (langCode === DEFAULT_LANG) return basePath
  const seg = langCode.toLowerCase()
  return basePath === '/' ? `/${seg}` : `/${seg}${basePath}`
}

// Liens <link rel="alternate" hreflang="..."> pour une route donnée,
// une entrée par langue supportée + x-default (pointe vers la version ES).
export function alternateLinks(routeName) {
  const basePath = ROUTE_BASE_PATHS[routeName]
  if (!basePath) return []

  const links = SUPPORTED_LANGS.map((code) => ({
    hreflang: HREFLANG_CODES[code],
    href: `${SITE_ORIGIN}${localizedPath(basePath, code)}`,
  }))

  links.push({ hreflang: 'x-default', href: `${SITE_ORIGIN}${basePath}` })

  return links
}
