"use client";

import Link from "next/link";
import GrillePokemon from "@/components/GrillePokemon";
import { SqueletteGrille } from "@/components/Squelettes";
import { usePokemons } from "@/hooks/usePokemons";
import { useStoresHydrates } from "@/hooks/useStoresHydrates";
import { useFavoris } from "@/stores/favoris";

export default function ListeFavoris() {
  const hydrate = useStoresHydrates();
  const noms = useFavoris((etat) => etat.noms);
  const { pokemons, chargement, erreur, reessayer } = usePokemons(hydrate ? noms : []);

  if (!hydrate || (chargement && pokemons.length === 0)) {
    return <SqueletteGrille nombre={Math.max(noms.length, 6)} />;
  }

  if (erreur) {
    return (
      <div role="alert" className="space-y-3 rounded-2xl border border-red-200 p-6 text-center dark:border-red-900">
        <p>Impossible de charger vos favoris : {erreur}</p>
        <button
          type="button"
          onClick={reessayer}
          className="rounded-full px-5 py-2 font-semibold bouton-or"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (noms.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
        <p aria-hidden="true" className="text-4xl text-accent">
          ☆
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Aucun favori pour l’instant. Touchez l’étoile d’une carte pour l’ajouter ici.
        </p>
        <Link href="/" className="inline-block rounded-full px-5 py-2 font-semibold bouton-or">
          Parcourir le Pokédex
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {noms.length} favori{noms.length > 1 ? "s" : ""}
      </p>
      <GrillePokemon pokemons={pokemons} />
    </div>
  );
}
