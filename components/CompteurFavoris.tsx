"use client";

import { useFavoris } from "@/stores/favoris";

export default function CompteurFavoris() {
  // Le sélecteur renvoie un nombre : on ne se réaffiche que quand il change.
  const nombre = useFavoris((etat) => etat.noms.length);
  return (
    <span className="rounded-full bg-white/10 px-1.5 text-xs font-bold tabular-nums text-gray-200">
      <span className="sr-only">: </span>
      {nombre}
    </span>
  );
}
