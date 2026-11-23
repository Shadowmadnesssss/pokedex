import { create } from "zustand";
import { persist } from "zustand/middleware";

type EtatFavoris = {
  noms: string[];
  basculer: (nom: string) => void;
};

export const useFavoris = create<EtatFavoris>()(
  persist(
    (set) => ({
      noms: [],
      // On renvoie toujours un NOUVEAU tableau, on ne modifie jamais l'ancien.
      basculer: (nom) =>
        set((etat) => ({
          noms: etat.noms.includes(nom)
            ? etat.noms.filter((n) => n !== nom)
            : [...etat.noms, nom],
        })),
    }),
    {
      name: "pokedex-favoris",
      // Le serveur n'a pas de localStorage : on relit le stockage après
      // le premier affichage (voir HydratationStores) pour éviter une erreur d'hydratation.
      skipHydration: true,
    },
  ),
);
