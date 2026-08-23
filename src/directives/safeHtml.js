import DOMPurify from 'dompurify'

// Remplace v-html : injecte du HTML assaini par DOMPurify plutôt que brut.
// Le contenu vient aujourd'hui de JSON statiques gérés par nous, mais tout
// contenu affiché via innerHTML doit être traité comme non fiable par principe.
export default {
  mounted(el, binding) {
    el.innerHTML = DOMPurify.sanitize(binding.value ?? '')
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.innerHTML = DOMPurify.sanitize(binding.value ?? '')
    }
  },
}
