"use client";

import { TAILLE_MAX, useSacoche } from "@/stores/sacoche";

/** Six pastilles, pleines ou vides. Ne se réaffiche que si la TAILLE de l'équipe change. */
export default function IndicateurSacoche() {
  const taille = useSacoche((etat) => etat.equipe.length);
  return (
    <span className="flex items-center gap-0.5" aria-label={`${taille} sur ${TAILLE_MAX}`} role="img">
      {Array.from({ length: TAILLE_MAX }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-2.5 w-2.5 rounded-full border border-white ${i < taille ? "bg-white" : "bg-transparent"}`}
        />
      ))}
    </span>
  );
}
