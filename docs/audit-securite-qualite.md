# Audit sécurité & qualité de code — LPB_1.0_Vue

Date : 2026-08-23
Périmètre : `LPB_1.0_Vue/` (Vue 3, Vue Router 4, Tailwind CSS 4, Vite 7, axios, swiper, html2pdf.js).
Audit en lecture seule — aucune correction appliquée.

## Sécurité

### Critique

1. **Dépendances avec vulnérabilités critiques** — `npm audit` sur `package.json` remonte
   13 vulnérabilités : **4 critiques**, 7 hautes, 2 modérées.
   - `swiper` (6.5.1–12.1.1) — critique
   - `jspdf` (≤4.2.0, transitive via `html2pdf.js`) — critique
   - `form-data` (4.0.0–4.0.5, transitive) — critique
   - `tar` (≤7.5.20, transitive) — critique
   - `axios` (1.0.0–1.17.0) — haute : DoS par absence de limite de taille de réponse, et
     bypass SSRF via `NO_PROXY` (moins pertinent ici, pas d'usage serveur, mais impacte
     tout appel `axios.get` fait depuis le navigateur de l'utilisateur si un attaquant
     contrôle une réponse volumineuse)
   - `vite` (7.0.0–7.3.3), `rollup`, `postcss`, `nanoid`, `picomatch` — hautes, côté outillage
     de build (impact surtout en dev/CI, pas en prod statique)
   - `dompurify` (≤3.4.12), `follow-redirects` (≤1.15.11) — modérées, transitives via
     `html2pdf.js`/`jspdf`

2. **`v-html` sans sanitisation sur du contenu externe** — 6 occurrences, toutes sur des
   champs `texte` provenant des fichiers JSON servis par `public/data/<LANG>/` :
   - `src/components/Concept.vue:4`
   - `src/pages/Menu.vue:109`
   - `src/pages/NostraHistoria.vue:62`, `:75`, `:89`
   - `src/pages/Home.vue:135`
   - `src/pages/MentionLegal.vue:49`

   Aujourd'hui ces JSON sont statiques et gérés par vous, donc le risque XSS immédiat est
   faible. Mais `dompurify` est déjà présent dans l'arbre de dépendances (transitif) sans
   être utilisé par le code applicatif : si ce contenu venait un jour d'un CMS, d'un
   formulaire de traduction externalisé, ou d'un service tiers, ces 6 points deviennent
   des injections XSS stockées. Import `DOMPurify` en dépendance directe et l'utiliser
   avant chaque `v-html` coûte peu et couvre ce risque futur.

### Majeur

3. **Endpoint de formulaire codé en dur et exposé côté client** —
   `src/components/Formulaire.vue:28` — `https://formsubmit.co/ajax/88684e3280c614c43f5fc6b0b01e67e1`.
   Ce hash identifie votre boîte de réception FormSubmit ; il est visible par quiconque
   inspecte le bundle JS. N'importe qui peut le rejouer directement (curl/Postman) pour
   spammer cette adresse, en dehors du site. Un honeypot (`_honey`, ligne 58) est déjà en
   place, ce qui aide, mais aucun CAPTCHA ni rate-limit visible côté client.
   → Pas de faille de code à corriger à proprement parler (FormSubmit fonctionne ainsi
   par design), mais à documenter comme risque accepté ou à durcir (reCAPTCHA FormSubmit,
   `_captcha:true`).

4. **Aucune validation serveur visible** — la seule validation est côté client
   (`required`, `type="email"`, `type="date"` sur les inputs de `Formulaire.vue`).
   FormSubmit fait un minimum de filtrage anti-spam mais aucune règle métier (ex. date
   dans le futur, format téléphone) n'est appliquée nulle part côté serveur — normal vu
   l'absence de backend propre, à garder en tête si un jour un vrai backend est ajouté.

### Mineur

5. **`.htaccess` (`www/.htaccess`) sans en-têtes de sécurité** — aucun
   `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, ou
   `Strict-Transport-Security`. Pas de directive interdisant le listing de répertoire
   (`Options -Indexes`) non plus. Impact limité pour un site vitrine statique, mais
   coût de correction très faible.
6. Pas de `.env` détecté et rien de `VITE_*` exposé anormalement dans `src/` — bon point,
   rien à corriger ici.
7. Aucun secret/clé API en dur trouvé ailleurs dans `src/` (grep sur les patterns
   `api_key|secret|token|password|bearer` sans résultat additionnel).

## Qualité de code

### Majeur

8. **Duplication de la logique de fetch multilingue** — le pattern
   `const base = \`/data/${currentLang.value}\`` suivi d'un `Promise.all([axios.get(...)])`
   est recopié à l'identique dans 6 fichiers : `Home.vue:26`, `MentionLegal.vue:17`,
   `Menu.vue:49`, `NostraHistoria.vue:19`, `Footer.vue:15`, `Navigation.vue:17`.
   Un composable unique (`useApiData(files)` ou équivalent dans `composables/`)
   éliminerait la duplication et centraliserait la gestion d'erreur (aujourd'hui absente
   sur ces appels : aucun `try/catch` visible autour de ces `Promise.all`, une 404 sur un
   JSON casse silencieusement le rendu).
9. **Coquille dans `NostraHistoria.vue:19`** — `currentLang .value` (espace avant `.value`)
   fonctionne mais trahit un copier-coller non relu de `Home.vue`.
10. **`Menu.vue` fait 287 lignes** — le plus gros fichier du projet, mélange fetch de 5
    endpoints JSON, filtrage par catégorie, et rendu. Bon candidat pour extraire au moins
    la logique de récupération/filtrage dans un composable dédié (`useMenu.js`), en
    cohérence avec le point 8.

### Mineur

11. **Fichier mort** — `src/components/InstagramComponent.vue` est vide (0 ligne) alors
    que `ReseauComponent.vue` semble jouer ce rôle. À supprimer si confirmé inutilisé
    (vérifier qu'aucune page ne l'importe avant suppression).
12. **`useLang.js` sans persistance ni détection** — `currentLang` est hardcodé à `'ES'`
    au démarrage (`src/composables/useLang.js:4`), donc chaque visiteur arrive en
    espagnol par défaut indépendamment de la langue du navigateur, et le choix de langue
    n'est pas mémorisé entre les pages/sessions (pas de `localStorage`). À trancher :
    comportement voulu ou oubli ?
13. **Absence totale de tests automatisés** — déjà connu et acté dans le `CLAUDE.md`
    (TDD à mettre en place), pas une découverte de cet audit.

## Plan de correction (ordre d'exécution recommandé)

1. **Mettre à jour les dépendances vulnérables critiques/hautes** — `swiper`, `html2pdf.js`
   (qui entraîne `jspdf`), `axios`, `vite` en priorité (finding 1). Tester le build et le
   carrousel/export PDF après upgrade : ce sont des montées de version majeures pour
   `swiper` (11→14) et `html2pdf.js`/`vite`, donc à faire sur une branche dédiée avec
   vérification manuelle des pages Menu (carrousel) et export PDF.
2. **Sanitiser les 6 `v-html`** avec `DOMPurify` en dépendance directe (finding 2) —
   petit effort, ferme un risque XSS futur avant qu'il ne devienne réel.
3. **Ajouter la gestion d'erreur sur les appels `axios`/`Promise.all`** des 6 fichiers
   concernés par le finding 8, en même temps que l'extraction du composable partagé —
   les deux se corrigent ensemble.
4. **Corriger la coquille `currentLang .value`** (finding 9) — trivial, à faire dans le
   même passage que le point 3.
5. **Ajouter les en-têtes de sécurité et `Options -Indexes` dans `www/.htaccess`**
   (finding 5) — faible effort, gain de posture sécurité.
6. **Décider du comportement de `useLang`** (détection navigateur + persistance,
   finding 12) — dépend d'un choix produit, à trancher avec vous avant d'implémenter.
7. **Durcir ou documenter le risque `Formulaire.vue`** (findings 3-4) — évaluer
   l'activation du CAPTCHA FormSubmit (`_captcha:true`) si le spam devient un problème
   réel ; sinon documenter le risque accepté dans le `CLAUDE.md`.
8. **Extraire la logique de fetch de `Menu.vue`** dans un composable dédié (finding 10) —
   à faire une fois le composable partagé du point 3 en place, pour éviter de le refaire
   deux fois.
9. **Supprimer `InstagramComponent.vue`** si confirmé mort (finding 11) — dernier, sans
   risque, à vérifier par un grep d'import avant suppression.
