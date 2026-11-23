"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Renvoie une fonction stable qui n'appelle `rappel` que `delai` ms après le DERNIER appel.
 * On temporise l'appel lui-même, depuis le gestionnaire d'événement : pas d'effet qui
 * réagit à la saisie (ce qui cassait le bouton « Précédent » du navigateur).
 */
export function useRappelTemporise<A extends unknown[]>(
  rappel: (...args: A) => void,
  delai: number,
) {
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dernierRappel = useRef(rappel);

  // On garde la dernière version de la fonction, sans réafficher.
  useEffect(() => {
    dernierRappel.current = rappel;
  }, [rappel]);

  // Nettoyage : on annule le minuteur si le composant disparaît.
  useEffect(() => {
    return () => {
      if (minuteur.current) clearTimeout(minuteur.current);
    };
  }, []);

  return useCallback(
    (...args: A) => {
      if (minuteur.current) clearTimeout(minuteur.current);
      minuteur.current = setTimeout(() => dernierRappel.current(...args), delai);
    },
    [delai],
  );
}
