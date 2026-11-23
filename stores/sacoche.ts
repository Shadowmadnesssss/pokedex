import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MembreEquipe } from "@/types/pokemon";

export const TAILLE_MAX = 6;

type EtatSacoche = {
  equipe: MembreEquipe[];
  ajouter: (membre: MembreEquipe) => void;
  retirer: (id: number) => void;
  renommer: (id: number, surnom: string) => void;
  vider: () => void;
};

/*
  Les règles métier vivent ICI, pas dans les boutons :
  même si un bouton oublie de se désactiver, la sacoche ne dépassera jamais six
  et n'acceptera jamais de doublon.
  « Pleine ? » et « types couverts » se calculent à partir de equipe : on ne les stocke pas.
*/
export const useSacoche = create<EtatSacoche>()(
  persist(
    (set) => ({
      equipe: [],
      ajouter: (membre) =>
        set((etat) => {
          if (etat.equipe.length >= TAILLE_MAX) return etat;
          if (etat.equipe.some((m) => m.id === membre.id)) return etat;
          const { id, nom, nomFr, image, types } = membre;
          return { equipe: [...etat.equipe, { id, nom, nomFr, image, types }] };
        }),
      retirer: (id) => set((etat) => ({ equipe: etat.equipe.filter((m) => m.id !== id) })),
      renommer: (id, surnom) =>
        set((etat) => ({
          equipe: etat.equipe.map((m) =>
            m.id === id ? { ...m, surnom: surnom.slice(0, 20) || undefined } : m,
          ),
        })),
      vider: () => set({ equipe: [] }),
    }),
    { name: "pokedex-sacoche", skipHydration: true },
  ),
);
