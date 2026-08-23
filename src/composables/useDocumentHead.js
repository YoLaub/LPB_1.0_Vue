import { alternateLinks, localizedPath, ROUTE_BASE_PATHS, SITE_ORIGIN } from '../lib/i18n.js'
import { useLang } from './useLang.js'

// Écrit le titre, la meta description, le canonical et les balises
// hreflang dans le <head> pour la page/langue courante. page.json fournit
// déjà titre/meta par page et par langue — jusqu'ici rien ne les exploitait,
// donc toutes les pages partageaient le même <title>/<meta description>
// statique de index.html, et aucune balise hreflang n'existait.
export function useDocumentHead() {
  const { currentLang } = useLang()

  function setTitle(title) {
    if (title) document.title = title
  }

  function setDescription(description) {
    if (!description) return
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }

  // Le canonical d'une page localisée doit pointer vers SA PROPRE URL (pas
  // systématiquement vers la version ES) : chaque langue est une page
  // légitime à part entière, pas un doublon — c'est le hreflang qui relie
  // les versions entre elles, pas le canonical.
  function setCanonical(routeName) {
    const basePath = ROUTE_BASE_PATHS[routeName]
    if (!basePath) return
    let tag = document.querySelector('link[rel="canonical"]')
    if (!tag) {
      tag = document.createElement('link')
      tag.setAttribute('rel', 'canonical')
      document.head.appendChild(tag)
    }
    tag.setAttribute('href', `${SITE_ORIGIN}${localizedPath(basePath, currentLang.value)}`)
  }

  // Retire les balises hreflang précédemment injectées, puis ajoute celles
  // de la route courante (une par langue supportée + x-default).
  function setAlternateLinks(routeName) {
    document.querySelectorAll('link[data-i18n-alt]').forEach((el) => el.remove())
    for (const { hreflang, href } of alternateLinks(routeName)) {
      const link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', hreflang)
      link.setAttribute('href', href)
      link.setAttribute('data-i18n-alt', 'true')
      document.head.appendChild(link)
    }
  }

  // `page` : l'objet page.json courant, avec ses champs `titre`/`meta`.
  // `routeName` : nom de la route Vue Router (Home, Menu, ...).
  function setHeadFromPage(page, routeName) {
    if (!page) return
    setTitle(page.titre)
    setDescription(page.meta)
    setCanonical(routeName)
    setAlternateLinks(routeName)
  }

  return { setTitle, setDescription, setCanonical, setAlternateLinks, setHeadFromPage }
}
