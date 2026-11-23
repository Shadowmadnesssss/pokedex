# PokÃ©dex

Application web qui affiche les **1 025 PokÃ©mon** avec leurs illustrations officielles : recherche, filtres par type, fiches dÃ©taillÃ©es, favoris et sacoche d'Ã©quipe. Projet final du cours *Next.js PokÃ©dex*.

**DÃ©mo en ligne :** _(Ã  complÃ©ter avec l'adresse Vercel)_

## Technologies

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, `cacheComponents` + `partialPrefetching`)
- React 19, [Tailwind CSS 4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs) pour l'Ã©tat partagÃ© (favoris, sacoche), avec `persist`
- [PokÃ©API](https://pokeapi.co) : donnÃ©es publiques, sans clÃ©

## FonctionnalitÃ©s

| FonctionnalitÃ© | OÃ¹ |
| --- | --- |
| Liste paginÃ©e (24 par page), illustration, numÃ©ro, types | `app/page.tsx` |
| Recherche (nom franÃ§ais, anglais ou numÃ©ro) et filtre par type, **rangÃ©s dans l'adresse** (`/?q=pika&type=electric&page=2`) | `components/BarreRecherche.tsx`, `components/FiltreTypes.tsx` |
| Fiche : grande image, types, taille, poids, 6 statistiques en barres, chaÃ®ne d'Ã©volution cliquable, nom franÃ§ais | `app/pokemon/[nom]/page.tsx` |
| Favoris conservÃ©s dans le navigateur | `stores/favoris.ts`, `app/favoris` |
| Sacoche : 6 PokÃ©mon max, sans doublon, surnoms, conservÃ©e entre les visites. Les rÃ¨gles sont dans le store | `stores/sacoche.ts`, `app/sacoche` |
| Squelettes de chargement, page d'erreur avec Â« RÃ©essayer Â», page 404 | `loading.tsx`, `error.tsx`, `not-found.tsx` |
| Titres par page, 151 fiches prÃ©-gÃ©nÃ©rÃ©es (`generateStaticParams`) | `app/pokemon/[nom]/page.tsx` |
| Route Handler `/api/aleatoire` + bouton Â« Hasard Â» | `app/api/aleatoire/route.ts` |
| Responsive (2 Ã  6 colonnes), thÃ¨me sombre automatique, clavier (`/` pour chercher), textes `alt` | partout |

**Bonus :** noms franÃ§ais (recherche comprise), badges des types couverts par la sacoche, ajout rapide depuis les cartes, sélecteur de visuel sur la fiche (illustration, rendu 3D HOME, 3D chromatique, sprite animé), comparateur de statistiques (`/comparer?a=dracaufeu&b=tortank`).

## Organisation du code

```
app/          pages et routes (App Router)
components/   composants d'interface (serveur par dÃ©faut, "use client" seulement si interactif)
hooks/        hooks personnalisÃ©s (usePokemons, useRappelTemporise, useRaccourci, useTypesCouverts)
lib/          couche d'accÃ¨s aux donnÃ©es
  chargement.ts   appels rÃ©seau bruts (serveur et navigateur)
  pokeapi.ts      fonctions serveur mises en cache ("use cache" + cacheLife("days"))
  conversion.ts   conversion de la rÃ©ponse brute de l'API vers le type Pokemon
  recherche.ts    lecture et validation des paramÃ¨tres d'adresse, filtrage
  types-pokemon.ts  table des 18 types (libellÃ© franÃ§ais, classes Tailwind)
stores/       stores Zustand (favoris, sacoche)
types/        types TypeScript (rÃ©ponses brutes de l'API et types de l'application)
```

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start   # version de production
```

## DÃ©ploiement

Le dÃ©pÃ´t est reliÃ© Ã  Vercel : chaque `git push` sur `main` redÃ©ploie l'application.

---

DonnÃ©es : [PokÃ©API](https://pokeapi.co). PokÃ©mon est une marque de Nintendo, Game Freak et The PokÃ©mon Company. Projet pÃ©dagogique, non commercial.
