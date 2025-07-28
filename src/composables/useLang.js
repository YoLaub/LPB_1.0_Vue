import { ref } from 'vue'

const currentLang = ref('ES')

export function useLang() {
  return {
    currentLang
  }
}
