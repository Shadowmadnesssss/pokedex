"use client";

import { useEffect } from "react";
import { useHydratation } from "@/hooks/useStoresHydrates";
import { useFavoris } from "@/stores/favoris";
import { useSacoche } from "@/stores/sacoche";

/**
 * Relit favoris et sacoche depuis localStorage APRÈS le premier affichage :
 * le premier HTML du navigateur reste identique à celui du serveur (pas d'erreur d'hydratation).
 */
export default function HydratationStores() {
  useEffect(() => {
    Promise.all([useFavoris.persist.rehydrate(), useSacoche.persist.rehydrate()]).finally(() =>
      useHydratation.setState({ pret: true }),
    );
  }, []);
  return null;
}
