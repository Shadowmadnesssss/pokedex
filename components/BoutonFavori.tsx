"use client";

import { useFavoris } from "@/stores/favoris";

type Props = { nom: string; nomAffiche: string; grand?: boolean };

export default function BoutonFavori({ nom, nomAffiche, grand = false }: Props) {
  // Sélecteur : ce bouton ne se réaffiche que si SA valeur change.
  const estFavori = useFavoris((etat) => etat.noms.includes(nom));
  const basculer = useFavoris((etat) => etat.basculer);

  return (
    <button
      type="button"
      onClick={() => basculer(nom)}
      aria-pressed={estFavori}
      aria-label={estFavori ? `Retirer ${nomAffiche} des favoris` : `Ajouter ${nomAffiche} aux favoris`}
      title={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition hover:scale-110 motion-reduce:hover:scale-100 dark:bg-gray-800/80 ${
        grand ? "h-11 w-11 text-2xl" : "h-8 w-8 text-lg"
      } ${estFavori ? "text-amber-500" : "text-gray-500 dark:text-gray-400"}`}
    >
      <span aria-hidden="true">{estFavori ? "★" : "☆"}</span>
    </button>
  );
}
