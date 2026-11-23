"use client";

import { create } from "zustand";

/** Passe à vrai quand HydratationStores a fini de relire favoris et sacoche. */
export const useHydratation = create<{ pret: boolean }>(() => ({ pret: false }));

/**
 * Vrai une fois les favoris et la sacoche relus depuis localStorage.
 * Évite d'afficher « Aucun favori » pendant une fraction de seconde au chargement.
 */
export function useStoresHydrates(): boolean {
  return useHydratation((etat) => etat.pret);
}
