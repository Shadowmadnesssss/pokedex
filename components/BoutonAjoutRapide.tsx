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
      className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold backdrop-blur transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 motion-reduce:hover:scale-100 ${
        dansSacoche
          ? "bouton-or"
          : "border border-white/10 bg-black/40 text-gray-200 hover:border-accent/60 hover:text-accent"
      }`}
    >
      <span aria-hidden="true">{dansSacoche ? "✓" : "+"}</span>
    </button>
  );
}
