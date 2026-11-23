"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CLASSES_LIEN_NAV } from "@/components/LienNav";

/** Appelle notre Route Handler /api/aleatoire puis ouvre la fiche reçue. */
export default function BoutonHasard() {
  const router = useRouter();
  const [enAttente, demarrer] = useTransition();
  const [erreur, setErreur] = useState(false);

  async function tirer() {
    setErreur(false);
    try {
      const reponse = await fetch("/api/aleatoire", { cache: "no-store" });
      if (!reponse.ok) throw new Error();
      const { nom } = (await reponse.json()) as { nom: string };
      demarrer(() => router.push(`/pokemon/${nom}`));
    } catch {
      setErreur(true);
    }
  }

  return (
    <button
      type="button"
      onClick={tirer}
      disabled={enAttente}
      title={erreur ? "Le tirage a échoué, réessayez" : "Un Pokémon au hasard"}
      className={`${CLASSES_LIEN_NAV} text-gray-400 hover:text-white disabled:opacity-60`}
    >
      <span aria-hidden="true">🎲</span>
      {enAttente ? "…" : erreur ? "Réessayer" : "Hasard"}
    </button>
  );
}
