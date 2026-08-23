import { ref, watch } from 'vue'

const SUPPORTED_LANGS = ['ES', 'EN', 'FR', 'PG']
const STORAGE_KEY = 'lpb-lang'

function detectInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored
  } catch {
    // localStorage indisponible (navigation privée, etc.) : on ignore et on détecte
  }

  const browserLang = (navigator.language || '').slice(0, 2).toUpperCase()
  // "PT" (portugais) est rangé sous le code de dossier existant "PG"
  const mapped = browserLang === 'PT' ? 'PG' : browserLang
  if (SUPPORTED_LANGS.includes(mapped)) return mapped

  return 'ES'
}

const currentLang = ref(detectInitialLang())

watch(currentLang, (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // localStorage indisponible : le choix ne sera simplement pas mémorisé
  }
})

export function useLang() {
  return {
    currentLang
  }
}
