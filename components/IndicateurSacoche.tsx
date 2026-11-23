"use client";

import { TAILLE_MAX, useSacoche } from "@/stores/sacoche";

type Props = { variante?: "entete" | "onglets" };

/** Six pastilles, pleines ou vides. Ne se réaffiche que si la TAILLE de l'équipe change. */
export default function IndicateurSacoche({ variante = "entete" }: Props) {
  const taille = useSacoche((etat) => etat.equipe.length);
  const pleine = variante === "entete" ? "bg-white border-white" : "bg-accent border-accent";
  const vide = variante === "entete" ? "border-white" : "border-gray-400 dark:border-gray-500";
  const dimension = variante === "entete" ? "h-2.5 w-2.5" : "h-1.5 w-1.5";

  return (
    <span className="flex items-center gap-0.5" aria-label={`${taille} sur ${TAILLE_MAX}`} role="img">
      {Array.from({ length: TAILLE_MAX }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${dimension} rounded-full border ${i < taille ? pleine : `${vide} bg-transparent`}`}
        />
      ))}
    </span>
  );
}
