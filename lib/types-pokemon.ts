/**
 * Table de correspondance des 18 types.
 * Les classes sont écrites EN ENTIER : Tailwind ne génère que les classes
 * qu'il lit telles quelles dans le code (`bg-type-${t}` ne marcherait pas).
 * La donnée reste en anglais ; on ne traduit qu'à l'affichage.
 */
export const TYPES = {
  normal: { libelle: "Normal", classes: "bg-type-normal text-gray-950" },
  fire: { libelle: "Feu", classes: "bg-type-fire text-white" },
  water: { libelle: "Eau", classes: "bg-type-water text-white" },
  electric: { libelle: "Électrik", classes: "bg-type-electric text-gray-950" },
  grass: { libelle: "Plante", classes: "bg-type-grass text-gray-950" },
  ice: { libelle: "Glace", classes: "bg-type-ice text-gray-950" },
  fighting: { libelle: "Combat", classes: "bg-type-fighting text-gray-950" },
  poison: { libelle: "Poison", classes: "bg-type-poison text-white" },
  ground: { libelle: "Sol", classes: "bg-type-ground text-white" },
  flying: { libelle: "Vol", classes: "bg-type-flying text-gray-950" },
  psychic: { libelle: "Psy", classes: "bg-type-psychic text-gray-950" },
  bug: { libelle: "Insecte", classes: "bg-type-bug text-gray-950" },
  rock: { libelle: "Roche", classes: "bg-type-rock text-gray-950" },
  ghost: { libelle: "Spectre", classes: "bg-type-ghost text-white" },
  dragon: { libelle: "Dragon", classes: "bg-type-dragon text-white" },
  dark: { libelle: "Ténèbres", classes: "bg-type-dark text-white" },
  steel: { libelle: "Acier", classes: "bg-type-steel text-gray-950" },
  fairy: { libelle: "Fée", classes: "bg-type-fairy text-gray-950" },
} as const;

export type NomType = keyof typeof TYPES;

export const NOMS_TYPES = Object.keys(TYPES) as NomType[];

export function estUnType(valeur: unknown): valeur is NomType {
  return typeof valeur === "string" && valeur in TYPES;
}

export const LIBELLES_STATS: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};
