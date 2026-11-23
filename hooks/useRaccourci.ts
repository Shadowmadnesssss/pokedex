"use client";

import { useEffect, useRef } from "react";

/** Appelle `action` quand on appuie sur `touche`, sauf si l'utilisateur écrit déjà dans un champ. */
export function useRaccourci(touche: string, action: () => void) {
  const derniereAction = useRef(action);

  useEffect(() => {
    derniereAction.current = action;
  }, [action]);

  useEffect(() => {
    function surTouche(e: KeyboardEvent) {
      const cible = e.target as HTMLElement | null;
      const enSaisie =
        cible?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(cible?.tagName ?? "");
      if (e.key === touche && !enSaisie && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        derniereAction.current();
      }
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [touche]);
}
