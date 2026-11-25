"use client";

import { useEffect } from "react";
import { ouvrirConsole } from "@/lib/console";

/** ↑ ↑ ↓ ↓ ← → ← → B A : le code Konami ouvre la console cachée. */
const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function CodeSecret() {
  useEffect(() => {
    let position = 0;
    function surTouche(e: KeyboardEvent) {
      const touche = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (touche === SEQUENCE[position]) {
        position += 1;
        if (position === SEQUENCE.length) ouvrirConsole();
      } else {
        // Une erreur remet à zéro (sauf si la touche est le début de la séquence)
        position = touche === SEQUENCE[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, []);

  return null;
}
