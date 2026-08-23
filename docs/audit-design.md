# Audit design & UX — LPB_1.0_Vue

Date : 2026-08-23
Périmètre : navigation manuelle du site en local (`npm run dev`), pages Home,
Menu/Prestation, Nuestra Historia, Aviso Legal.

## Corrigé dans cette passe (branche `fix/menu-modal-parallax-design`)

1. **Le formulaire d'événement ne s'affichait jamais** — `src/pages/Menu.vue`.
   En cliquant sur "¡Prepará tu evento!" sur la page Menu, la modale du formulaire
   était bien injectée dans le DOM (bon contenu, bons champs) mais restait bloquée à
   `opacity: 0` en permanence à cause du `<transition name="zoom">` qui l'enveloppait
   combiné au `<Teleport to="body">` — la transition CSS scoped n'atteignait jamais son
   état final visible. **Impact : le formulaire de devis événementiel était
   inutilisable pour tout visiteur passant par la page Menu.** Corrigé en retirant le
   wrapper `<transition>` défaillant (la modale s'affiche maintenant immédiatement,
   avec un fond semi-transparent `bg-ardoise/40` ajouté pour la lisibilité) et en
   supprimant les classes CSS `.zoom-*` devenues mortes. Le CSS ajouté a été vérifié :
   seule la couleur `--color-ardoise` déjà définie dans `tailwing.css` a été utilisée
   (pas de couleur inventée).
2. **Grands vides dans la page Menu** — chaque bloc de catégorie (`Crêpes`, `Galettes`,
   `Quiches Lorraine`, `Bebidas`) avait une hauteur fixe `h-150` (600px) quel que soit le
   nombre d'items, ce qui laissait ~150-250px de vide sous les catégories courtes
   (ex. Quiches Lorraine, un seul item). Remplacé par `min-h-100`, qui garde un minimum
   propre tout en laissant chaque bloc s'adapter à son contenu réel.
3. **Effet de background non appliqué à la page NostraHistoria/Home** — voir section
   Parallax ci-dessous.

## Signalé, non corrigé (nécessite une décision produit)

4. **Placeholders non remplis dans l'Aviso Legal** (`public/data/<LANG>/*.json`,
   page Mentions légales) — le texte affiché contient littéralement
   `[www.tusitio.com]` et `CUIT: [CUIT]` au lieu des vraies valeurs. Domaine réel :
   `la-petite-bretagne.com` (vu dans `www/.htaccess`/sitemap). CUIT : _à décider_,
   je ne peux pas l'inventer — à me communiquer pour correction.
5. **Dates d'itinérance passées** — la section "Nuestra ruta de sabor" (Home) affiche
   "desde octubre a fines de diciembre 2025" — Nous sommes le 2026-08-23, ces dates
   sont donc dans le passé et probablement obsolètes. À vérifier avec vous : c'est une
   donnée métier dans `public/data/<LANG>/pageContain.json`, pas un bug de code.
6. **Bouton `¡Prepará tu evento!` sans style de bouton clair sur la page Menu**
   (`src/pages/Menu.vue:135`) — classes `bg-rougeLPB text-orange-100 my-5` seules,
   sans `padding`/`rounded` explicites contrairement au bouton équivalent sur Home
   (`bg-crepe/20 rounded-sm buttonMenu`). Fonctionne visuellement (le fond du `<h4>`
   donne l'illusion d'un bouton) mais l'incohérence de style entre les deux pages
   vaut la peine d'être unifiée — pas corrigé ici pour rester sur des changements
   ciblés, à inclure dans une prochaine passe design si vous validez.

## Effet de parallax — amélioration appliquée

`src/layouts/DefaultLayout.vue` : l'image de fond (le phare, `fond2.webp`) est en
`position: fixed`. L'ancienne implémentation faisait varier sa **largeur** au scroll
(`width: 1000 - scrollY/8`) : ça donne un effet de rétrécissement/zoom-out, pas un
vrai parallax (le fond ne se déplaçait jamais), et ça déclenche un recalcul de layout
(reflow) à chaque event de scroll — coûteux pour les performances.

Remplacé par une translation verticale via `transform: translate3d(0, scrollY*0.15px, 0)`
— propriété composée uniquement par le GPU (pas de reflow), qui fait vraiment
"glisser" le fond plus lentement que le contenu pendant le scroll (le vrai principe du
parallax). Le handler de scroll est en plus throttlé via `requestAnimationFrame` (au
lieu de recalculer à chaque event brut, potentiellement des dizaines de fois par
seconde). `alt="fond"` remplacé par `alt=""` : image purement décorative, un lecteur
d'écran ne doit pas l'annoncer.

## Commandes de vérification
- `cd LPB_1.0_Vue && npm run dev` puis naviguer sur `/`, `/menu_et_prestation`,
  `/nostra_historia`, `/mention_legal`.
