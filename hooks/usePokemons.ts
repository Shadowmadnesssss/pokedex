"use client";

import { useEffect, useState } from "react";
import { chargerPlusieurs } from "@/lib/chargement";
import type { Pokemon } from "@/types/pokemon";

type Resultat = { cle: string; pokemons: Pokemon[]; erreur: string | null };

/**
 * Charge dans le navigateur le détail d'une liste de Pokémon (page Favoris).
 * `noms` doit garder la même référence d'un affichage à l'autre (c'est le cas s'il vient du store).
 */
export function usePokemons(noms: string[]) {
  const cle = noms.join(",");
  const [resultat, setResultat] = useState<Resultat>({ cle: "", pokemons: [], erreur: null });
  const [essai, setEssai] = useState(0);

  useEffect(() => {
    let annule = false; // ignore une réponse devenue inutile
    const liste = cle ? cle.split(",") : [];
    chargerPlusieurs(liste)
      .then((pokemons) => {
        if (!annule) setResultat({ cle, pokemons, erreur: null });
      })
      .catch((e: unknown) => {
        if (!annule)
          setResultat({
            cle,
            pokemons: [],
            erreur: e instanceof Error ? e.message : "Erreur inconnue",
          });
      });
    return () => {
      annule = true;
    };
  }, [cle, essai]);

  // Le chargement se déduit : la réponse reçue ne correspond pas encore à la liste demandée.
  const chargement = resultat.cle !== cle;

  return {
    pokemons: chargement ? [] : resultat.pokemons,
    chargement,
    erreur: chargement ? null : resultat.erreur,
    reessayer: () => {
      setResultat((r) => ({ ...r, cle: "" }));
      setEssai((n) => n + 1);
    },
  };
}
