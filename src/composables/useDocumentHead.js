// Écrit le titre et la meta description dans le <head> pour la page courante.
// page.json fournit déjà `titre`/`meta` par page et par langue — jusqu'ici
// rien ne les exploitait, donc toutes les pages partageaient le même
// <title>/<meta description> statique de index.html.
export function useDocumentHead() {
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

  // `page` : l'objet page.json courant, avec ses champs `titre`/`meta`
  function setHeadFromPage(page) {
    if (!page) return
    setTitle(page.titre)
    setDescription(page.meta)
  }

  return { setTitle, setDescription, setHeadFromPage }
}
