import { localizedPath } from '../lib/i18n.js'
import { useLang } from './useLang.js'

// lp('/menu_et_prestation') -> '/menu_et_prestation' en ES (défaut, non
// préfixée), '/en/menu_et_prestation' en EN, etc. À utiliser pour tout lien
// interne (router-link :to, href) afin qu'il reste dans la langue courante.
export function useLocalizedPath() {
  const { currentLang } = useLang()

  function lp(basePath) {
    return localizedPath(basePath, currentLang.value)
  }

  return { lp }
}
