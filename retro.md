# Rétro projet

## 2026-08-23 — hreflang / routes localisées (okf-1)
- Toujours faire vérifier le `<link rel="canonical">` d'une page i18n en E2E réel
  (naviguer dans le navigateur, lire le DOM), pas seulement en test unitaire sur la
  logique pure : un canonical qui pointe vers la mauvaise langue est invisible dans
  un test qui ne monte pas le composant, mais désindexe silencieusement les pages
  non-ES aux yeux de Google.
- Le hreflang exige que chaque langue ait sa propre URL — impossible de l'ajouter
  sans casser un système de langue "détection navigateur + affichage du contenu à
  la même URL" existant. Vérifier cette incompatibilité *avant* de proposer une
  fonctionnalité de détection de langue si un projet i18n via URL est prévisible.
