"use client";

import { useFavoris } from "@/stores/favoris";

export default function CompteurFavoris() {
  // Le sélecteur renvoie un nombre : on ne se réaffiche que quand il change.
  const nombre = useFavoris((etat) => etat.noms.length);
  return (
    <span className="rounded-full bg-white/90 px-1.5 text-xs font-bold tabular-nums text-red-700">
      <span className="sr-only">: </span>
      {nombre}
    </span>
  );
}
