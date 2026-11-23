"use client";

import { TAILLE_MAX, useSacoche } from "@/stores/sacoche";
import type { MembreEquipe } from "@/types/pokemon";

type Props = { pokemon: MembreEquipe };

/** Bouton de la fiche. La fiche (serveur) lui passe un objet de données simples : c'est permis. */
export default function BoutonSacoche({ pokemon }: Props) {
  const dansSacoche = useSacoche((etat) => etat.equipe.some((m) => m.id === pokemon.id));
  const taille = useSacoche((etat) => etat.equipe.length);
  const ajouter = useSacoche((etat) => etat.ajouter);
  const retirer = useSacoche((etat) => etat.retirer);
  const pleine = taille >= TAILLE_MAX;

  if (dansSacoche) {
    return (
      <button
        type="button"
        onClick={() => retirer(pokemon.id)}
        className="rounded-full border border-gray-300 px-5 py-2.5 font-semibold transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        Retirer de la sacoche
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pleine}
        onClick={() => ajouter(pokemon)}
        className="rounded-full bg-accent px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-700"
      >
        Ajouter à la sacoche ({taille}/{TAILLE_MAX})
      </button>
      {pleine && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          La sacoche est pleine : retirez un Pokémon d’abord.
        </p>
      )}
    </div>
  );
}
