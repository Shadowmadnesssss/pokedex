# Pokédex

Application web qui affiche les **1 025 Pokémon** avec leurs illustrations officielles : recherche, filtres par type, fiches détaillées, favoris et sacoche d'équipe. Projet final du cours *Next.js Pokédex*.

**Démo en ligne :** _(à compléter avec l'adresse Vercel)_

## Technologies

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, `cacheComponents` + `partialPrefetching`)
- React 19, [Tailwind CSS 4](https://tailwindcss.com)
- [Zustand](https://zustand.docs.pmnd.rs) pour l'état partagé (favoris, sacoche), avec `persist`
- [PokéAPI](https://pokeapi.co) : données publiques, sans clé

## Fonctionnalités

| Fonctionnalité | Où |
| --- | --- |
| Liste paginée (24 par page), illustration, numéro, types | `app/page.tsx` |
| Recherche (nom français, anglais ou numéro) et filtre par type, **rangés dans l'adresse** (`/?q=pika&type=electric&page=2`) | `components/BarreRecherche.tsx`, `components/FiltreTypes.tsx` |
| Fiche : grande image, types, taille, poids, 6 statistiques en barres, chaîne d'évolution cliquable, nom français | `app/pokemon/[nom]/page.tsx` |
| Favoris conservés dans le navigateur | `stores/favoris.ts`, `app/favoris` |
| Sacoche : 6 Pokémon max, sans doublon, surnoms, conservée entre les visites. Les règles sont dans le store | `stores/sacoche.ts`, `app/sacoche` |
| Squelettes de chargement, page d'erreur avec « Réessayer », page 404 | `loading.tsx`, `error.tsx`, `not-found.tsx` |
| Titres par page, 151 fiches pré-générées (`generateStaticParams`) | `app/pokemon/[nom]/page.tsx` |
| Route Handler `/api/aleatoire` + bouton « Hasard » | `app/api/aleatoire/route.ts` |
| Responsive (2 à 6 colonnes), thème sombre, clavier (`/` pour chercher), textes `alt` | partout |

**Bonus :** noms français (recherche comprise), badges des types couverts par la sacoche, ajout rapide depuis les cartes, sélecteur de visuel sur la fiche (illustration, rendu 3D HOME, chromatique, sprite animé), comparateur de statistiques (`/comparer?a=dracaufeu&b=tortank`).

**Interface :**

- Direction artistique « dark luxe » : noir profond, accents or, titres en serif (Cormorant Garamond), surfaces en verre, lueur de la couleur du type et léger grain.
- Transition animée (View Transitions de React) : l'image de la carte « vole » jusqu'à la fiche.
- Fiche en bandeau aux couleurs du type, avec catégorie et description du Pokédex en français.
- Graphique radar des statistiques en SVG (superposé pour deux Pokémon dans le comparateur).
- Faiblesses et résistances (×4, ×2, ×½, ×¼, ×0), calculées à partir des relations de types de l'API.
- Cartes teintées avec halo Poké Ball, filtres avec les icônes officielles des types.
- Barres de stats qui se remplissent, squelettes avec reflet, barre d'onglets en bas de l'écran sur téléphone.
- Toutes les animations sont coupées si le système demande de réduire les animations.

## Organisation du code

```
app/          pages et routes (App Router)
components/   composants d'interface (serveur par défaut, "use client" seulement si interactif)
hooks/        hooks personnalisés (usePokemons, useRappelTemporise, useRaccourci, useTypesCouverts)
lib/          couche d'accès aux données
  chargement.ts   appels réseau bruts (serveur et navigateur)
  pokeapi.ts      fonctions serveur mises en cache ("use cache" + cacheLife("days"))
  conversion.ts   conversion de la réponse brute de l'API vers le type Pokemon
  recherche.ts    lecture et validation des paramètres d'adresse, filtrage
  types-pokemon.ts  table des 18 types (libellé français, classes Tailwind)
stores/       stores Zustand (favoris, sacoche)
types/        types TypeScript (réponses brutes de l'API et types de l'application)
```

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start   # version de production
```

## Déploiement

Le dépôt est relié à Vercel : chaque `git push` sur `main` redéploie l'application.

---

Données : [PokéAPI](https://pokeapi.co). Pokémon est une marque de Nintendo, Game Freak et The Pokémon Company. Projet pédagogique, non commercial.
