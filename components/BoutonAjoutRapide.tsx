"use client";

import { TAILLE_MAX, useSacoche } from "@/stores/sacoche";
import type { MembreEquipe } from "@/types/pokemon";

type Props = { pokemon: MembreEquipe };

/** Bonus : ajout rapide à la sacoche depuis une carte de la liste. */
export default function BoutonAjoutRapide({ pokemon }: Props) {
  const dansSacoche = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const pleine = useSacoche((etat) => etat.equipe.length >= TAILLE_MAX);
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);

  const desactive = !dansSacoche && pleine;
  const libelle = dansSacoche
    ? `Retirer ${pokemon.nomFr} de la sacoche`
    : desactive
      ? "Sacoche pleine"
      : `Ajouter ${pokemon.nomFr} à la sacoche`;

  return (
    <button
      type="button"
      disabled={desactive}
      onClick={() => (dansSacoche ? retirer(pokemon.id) : ajouter(pokemon))}
      aria-pressed={dansSacoche}
      aria-label={libelle}
      title={libelle}
      className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold shadow-sm backdrop-blur transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 motion-reduce:hover:scale-100 ${
        dansSacoche
          ? "bg-accent text-white"
          : "bg-white/80 text-gray-700 dark:bg-gray-800/80 dark:text-gray-200"
      }`}
    >
      <span aria-hidden="true">{dansSacoche ? "✓" : "+"}</span>
    </button>
  );
}
