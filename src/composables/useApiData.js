import axios from 'axios'
import { ref } from 'vue'
import { useLang } from './useLang.js'

// Centralise le pattern répété dans Home/Menu/NostraHistoria/MentionLegal/
// Footer/Navigation : construire `/data/<LANG>/...`, faire un Promise.all
// d'axios.get, et logger/exposer l'erreur en cas d'échec.
export function useApiData() {
  const { currentLang } = useLang()
  const loading = ref(false)
  const error = ref(null)

  // fetchLangData(['page.json', 'pageContain.json']) -> [pageData, pageContainData] | null
  async function fetchLangData(files) {
    loading.value = true
    error.value = null
    try {
      const base = `/data/${currentLang.value}`
      const responses = await Promise.all(files.map((file) => axios.get(`${base}/${file}`)))
      return responses.map((res) => res.data)
    } catch (err) {
      console.error('Erreur lors de la récupération des données :', err)
      error.value = err
      return null
    } finally {
      loading.value = false
    }
  }

  return { currentLang, loading, error, fetchLangData }
}
