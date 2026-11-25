import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne pas supprimer : tout le chapitre 7 du cours repose sur ces deux options.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Les illustrations officielles sont hébergées sur GitHub par la PokéAPI.
    remotePatterns: [
      new URL("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/**"),
      new URL("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/**"),
    ],
  },
  /*
    La console (easter egg) fait tourner mGBA, qui utilise des threads (SharedArrayBuffer).
    Le navigateur ne les autorise que si la page est « isolée » : on ajoute ces en-têtes
    uniquement sur /console et sur les fichiers de l'émulateur, pas sur le reste du site.
  */
  async headers() {
    const isolation = [
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
    ];
    return [
      { source: "/console", headers: isolation },
      { source: "/mgba/:fichier*", headers: isolation },
    ];
  },
  turbopack: {
    // La racine du projet est ce dossier (évite de remonter vers un package-lock.json parent).
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
