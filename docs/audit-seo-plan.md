# Audit SEO & plan d'optimisation — LPB_1.0_Vue

Date : 2026-08-23
Périmètre : `LPB_1.0_Vue/` (source à venir en production) comparé à `www/` (site
actuellement déployé sur `la-petite-bretagne.com`). Audit + plan uniquement, aucun
code modifié pour le SEO dans cette passe.

## Constat central : la version actuellement en ligne (`www/`) est mieux référencée que la source (`LPB_1.0_Vue/`)

`www/index.html` (build déployé) contient un vrai `<title>`, une `meta description`,
des balises Open Graph/Twitter Card, et `lang="es"`. **`LPB_1.0_Vue/index.html` (la
source versionnée) ne contient rien de tout ça** : `<title>La petite Bretagne</title>`
générique, pas de `meta description`, pas d'Open Graph, `lang="en"` alors que le
contenu par défaut est en espagnol. Concrètement : quelqu'un a enrichi le HTML après
un build précédent, directement sur le serveur ou dans un ancien commit non repris ici.
**Le prochain `npm run build` depuis ce dépôt écrasera `www/index.html` et fera
régresser le SEO du site en production** si rien n'est fait avant de redéployer.

De la même façon, `robots.txt` et `sitemap.xml` existent dans `www/` mais **pas** dans
`LPB_1.0_Vue/public/` — un futur build ne les inclura pas.

## Autres constats

1. **Aucune gestion dynamique du titre/meta par page.** Le site est une SPA Vue
   (`vue-router`, pas de SSR/prerendering). `page.json` et `pageContain.json`
   contiennent déjà des champs `titre` et `meta` par page (pensés pour le SEO), mais
   rien dans le code (`grep` sur `document.title`, `meta[name`, `useHead` : aucun
   résultat) ne les écrit dans le `<head>`. Résultat : que le visiteur soit sur `/`,
   `/menu_et_prestation` ou `/nostra_historia`, l'onglet du navigateur et les moteurs
   de recherche voient toujours le même titre générique et aucune description —
   les 4 pages sont donc indifférenciées pour le SEO alors que le contenu (et les
   traductions FR/EN/ES/PT) existe déjà.
2. **Pas de SSR/prerendering.** Le contenu (crêpes, prix, horaires) n'existe qu'après
   exécution du JavaScript (fetch des JSON `public/data/<LANG>/`). Les crawlers
   modernes de Google exécutent le JS, mais d'autres (certains bots de réseaux
   sociaux, aperçus de liens) ne le font pas ou mal — impact direct sur les partages
   Instagram/WhatsApp (canal principal cité dans les mentions légales) où l'aperçu du
   lien peut apparaître vide.
3. **`lang` de la page jamais synchronisé avec la langue choisie.** `<html lang="en">`
   est statique dans `index.html`, alors que `useLang.js` gère 4 langues côté
   contenu. Un moteur de recherche ou lecteur d'écran voit toujours "anglais" même
   quand le visiteur est en français ou portugais.
4. **Pas de balises `hreflang`.** Avec 4 langues sur les mêmes URLs (`/`,
   `/menu_et_prestation`, …) sans distinction d'URL par langue, Google ne peut pas
   savoir qu'une version FR ou EN existe — actuellement, seule la langue par défaut
   (ES, cf. `useLang.js`) est indexable dans les faits.
5. **`sitemap.xml` incomplet et daté** — ne liste que 3 des 4 pages (absente : Aviso
   Legal — acceptable, page sans intérêt SEO) mais `lastmod` est figé au 2025-08-18
   pour toutes les URLs, alors que le contenu (menu, dates d'itinérance) change plus
   souvent.
6. **Images sans `alt` ou avec un `alt` non descriptif** — repéré pendant l'audit
   qualité : `src/components/ImageCarousel.vue:27` (carrousel Home, aucun `alt` du
   tout), et plusieurs `alt="Aventure"` / `alt="Illustration catégorie"` génériques
   (`Home.vue`, `Menu.vue`) qui ne décrivent pas l'image réelle.
7. **Pas de données structurées (JSON-LD)** — un site de restaurant/food truck
   bénéficie fortement du schéma `Restaurant` ou `FoodEstablishment`
   (schema.org) : horaires, zone de service, gamme de prix, images. Absent
   actuellement, alors que la plupart des données existent déjà dans
   `pageContain.json`/`carte.json`.
8. **Meta description de la page Menu potentiellement dupliquée avec Home** — à
   vérifier une fois la gestion dynamique en place (finding 1), pour éviter le
   duplicate content signalé par Search Console.

## Plan d'optimisation (ordre recommandé)

1. **Urgent avant tout prochain déploiement** : recopier manuellement dans
   `LPB_1.0_Vue/index.html` le contenu SEO déjà présent dans `www/index.html`
   (title par défaut, meta description, Open Graph, `lang="es"`), et copier
   `robots.txt` + `sitemap.xml` dans `LPB_1.0_Vue/public/`. Sans ça, le prochain
   build régresse le SEO actuel — c'est la seule action de ce plan à traiter avant
   toute autre, indépendamment du reste.
2. **Gestion dynamique du titre/description par page** (finding 1) — utiliser les
   champs `titre`/`meta` déjà présents dans `page.json`, et les écrire dans le
   `<head>` à chaque navigation (`@unhead/vue`, la librairie officielle de gestion
   du `<head>` pour Vue 3, est le choix standard ; alternative légère : un petit
   composable avec `watchEffect` sur `document.title` et la balise
   `meta[name="description"]`). Décision technique à valider avec vous avant
   implémentation (nouvelle dépendance ou solution maison).
3. **Synchroniser `<html lang>` avec `useLang`** (finding 3) — quelques lignes dans
   le composable ou le layout, faible effort, se fait naturellement avec le point 2.
4. **Évaluer le besoin de prerendering/SSR** (finding 2) — `vite-plugin-ssr` ou
   prerendering statique (`vite-plugin-prerender` / `unhead` + un script de build)
   selon combien le référencement organique compte réellement pour l'acquisition
   (à voir avec vous : le site vit surtout d'Instagram/WhatsApp actuellement d'après
   les mentions légales — le SEO organique est-il une priorité business ou un
   nice-to-have ?).
5. **Ajouter le JSON-LD `FoodEstablishment`** (finding 7) — une fois le point 2 en
   place (même mécanisme d'injection dans le `<head>`), effort modéré, bon gain pour
   l'affichage enrichi dans les résultats Google (horaires, note, etc.).
6. **Compléter les `alt` d'images** (finding 6) — petit effort, à faire avec le point
   11 de l'audit qualité de code (`InstagramComponent.vue` mort) dans la même passe
   de nettoyage.
7. **Automatiser `lastmod` du sitemap** (finding 5) — script de build simple qui date
   le sitemap à la date du dernier commit touchant `public/data/`, ou script manuel
   à mettre à jour à chaque changement de menu.
8. **`hreflang`** (finding 4) — dépend d'abord d'une décision produit : garder les 4
   langues sur la même URL (actuel) ou passer à des URLs préfixées (`/en/menu`,
   `/fr/menu`…) ? Sans changement d'URL par langue, `hreflang` n'apporte rien. À
   trancher avec vous — impact structurel plus large que les autres points de ce
   plan (retouche du routeur), donc positionné en dernier.

## Ce qui est déjà bon
- Un seul `<h1>` par page, présent partout (`Home`, `Menu`, `NostraHistoria`,
  `MentionLegal`).
- `robots.txt` autorise l'indexation complète et référence le sitemap (dans `www/`,
  à recopier — voir point 1 du plan).
- Contenu déjà traduit en 4 langues, prêt à être exploité une fois le `<head>`
  dynamique en place.
