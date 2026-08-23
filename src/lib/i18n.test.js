import { describe, it, expect } from 'vitest'
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  resolveLang,
  localizedPath,
  alternateLinks,
} from './i18n.js'

describe('resolveLang', () => {
  it('renvoie ES quand le paramètre de route est absent (langue par défaut, non préfixée)', () => {
    expect(resolveLang(undefined)).toBe('ES')
  })

  it('reconnaît les codes supportés en minuscule (tels que fournis par la regex de route)', () => {
    expect(resolveLang('en')).toBe('EN')
    expect(resolveLang('fr')).toBe('FR')
    expect(resolveLang('pg')).toBe('PG')
  })

  it('retombe sur ES pour un code non supporté', () => {
    expect(resolveLang('de')).toBe('ES')
  })
})

describe('localizedPath', () => {
  it('ne préfixe jamais ES, la langue par défaut', () => {
    expect(localizedPath('/', 'ES')).toBe('/')
    expect(localizedPath('/menu_et_prestation', 'ES')).toBe('/menu_et_prestation')
  })

  it('préfixe les autres langues avec leur code en minuscule', () => {
    expect(localizedPath('/menu_et_prestation', 'EN')).toBe('/en/menu_et_prestation')
    expect(localizedPath('/nostra_historia', 'FR')).toBe('/fr/nostra_historia')
  })

  it('gère la racine "/" sans doubler le slash', () => {
    expect(localizedPath('/', 'EN')).toBe('/en')
  })
})

describe('alternateLinks', () => {
  it('retourne une entrée par langue supportée plus x-default, absolues', () => {
    const links = alternateLinks('Menu')
    expect(links).toHaveLength(SUPPORTED_LANGS.length + 1)

    const es = links.find((l) => l.hreflang === 'es')
    expect(es.href).toBe('https://www.la-petite-bretagne.com/menu_et_prestation')

    const en = links.find((l) => l.hreflang === 'en')
    expect(en.href).toBe('https://www.la-petite-bretagne.com/en/menu_et_prestation')

    // le portugais est rangé sous le code de dossier interne "PG" mais le hreflang exposé doit être "pt"
    const pt = links.find((l) => l.hreflang === 'pt')
    expect(pt).toBeTruthy()
    expect(pt.href).toBe('https://www.la-petite-bretagne.com/pg/menu_et_prestation')

    const xDefault = links.find((l) => l.hreflang === 'x-default')
    expect(xDefault.href).toBe('https://www.la-petite-bretagne.com/menu_et_prestation')
  })

  it('renvoie un tableau vide pour un nom de route inconnu', () => {
    expect(alternateLinks('DoesNotExist')).toEqual([])
  })
})

describe('DEFAULT_LANG / SUPPORTED_LANGS', () => {
  it('ES est bien la langue par défaut et fait partie des langues supportées', () => {
    expect(DEFAULT_LANG).toBe('ES')
    expect(SUPPORTED_LANGS).toContain('ES')
  })
})
