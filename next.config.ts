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
