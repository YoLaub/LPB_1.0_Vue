---
id: okf-1
feature: hreflang-localized-routes
branch: seo/hreflang-localized-routes
status: done
files:
  - src/lib/i18n.js
  - src/composables/useLang.js
  - src/composables/useLocalizedPath.js
  - src/composables/useDocumentHead.js
  - src/router/index.js
  - src/components/Language.vue
  - public/sitemap.xml
tests:
  - src/lib/i18n.test.js
decisions:
  - "2026-08-23 : ES reste non préfixée, EN/FR/PG préfixées (/en, /fr, /pg) — Argentine/Uruguay est la cible prioritaire, aucune URL ES déjà indexée ne change (décision utilisateur)"
  - "2026-08-23 : pas de redirection auto selon la langue détectée du navigateur — Google déconseille de servir un contenu différent sur une même URL (décision utilisateur, annule le comportement de la feature précédente useLang détection/persistance)"
  - "2026-08-23 : canonical par page = sa propre URL localisée, jamais la version ES — sinon Google traite EN/FR/PG comme doublons de ES et les désindexe"
---

**Quoi** : Chaque page a désormais une URL par langue (ES non préfixée, EN/FR/PG
préfixées), avec balises `hreflang`/canonical générées dynamiquement
(`useDocumentHead`), un sélecteur de langue qui navigue au lieu de juste changer une
variable, et un `sitemap.xml` listant les 12 URLs (3 pages × 4 langues, hors mentions
légales) avec leurs `xhtml:link` alternates.

**Pièges** :
- Le canonical par défaut pointait vers `ROUTE_BASE_PATHS[routeName]` (toujours ES)
  au lieu de `localizedPath(basePath, currentLang)` — trouvé en E2E réel dans le
  navigateur, pas en test unitaire (la logique pure était testée, l'orchestration
  Vue ne l'était pas). Piège générique remonté dans `references/pieges.md` du skill.
