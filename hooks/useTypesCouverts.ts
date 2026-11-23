"use client";

import { NOMS_TYPES, type NomType } from "@/lib/types-pokemon";
import { useSacoche } from "@/stores/sacoche";

/** Les types présents dans la sacoche, dans l'ordre officiel. Calculé, jamais stocké. */
export function useTypesCouverts(): NomType[] {
  const equipe = useSacoche((etat) => etat.equipe);
  const presents = new Set(equipe.flatMap((m) => m.types));
  return NOMS_TYPES.filter((t) => presents.has(t));
}
