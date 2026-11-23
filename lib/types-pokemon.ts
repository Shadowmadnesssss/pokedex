/**
 * Table de correspondance des 18 types.
 * Les classes sont écrites EN ENTIER : Tailwind ne génère que les classes
 * qu'il lit telles quelles dans le code (`bg-type-${t}` ne marcherait pas).
 * La donnée reste en anglais ; on ne traduit qu'à l'affichage.
 * `numero` est l'identifiant du type dans la PokéAPI : il sert à trouver son icône.
 */
export const TYPES = {
  normal: { numero: 1, libelle: "Normal", classes: "bg-type-normal text-gray-950" },
  fire: { numero: 10, libelle: "Feu", classes: "bg-type-fire text-white" },
  water: { numero: 11, libelle: "Eau", classes: "bg-type-water text-white" },
  electric: { numero: 13, libelle: "Électrik", classes: "bg-type-electric text-gray-950" },
  grass: { numero: 12, libelle: "Plante", classes: "bg-type-grass text-gray-950" },
  ice: { numero: 15, libelle: "Glace", classes: "bg-type-ice text-gray-950" },
  fighting: { numero: 2, libelle: "Combat", classes: "bg-type-fighting text-gray-950" },
  poison: { numero: 4, libelle: "Poison", classes: "bg-type-poison text-white" },
  ground: { numero: 5, libelle: "Sol", classes: "bg-type-ground text-white" },
  flying: { numero: 3, libelle: "Vol", classes: "bg-type-flying text-gray-950" },
  psychic: { numero: 14, libelle: "Psy", classes: "bg-type-psychic text-gray-950" },
  bug: { numero: 7, libelle: "Insecte", classes: "bg-type-bug text-gray-950" },
  rock: { numero: 6, libelle: "Roche", classes: "bg-type-rock text-gray-950" },
  ghost: { numero: 8, libelle: "Spectre", classes: "bg-type-ghost text-white" },
  dragon: { numero: 16, libelle: "Dragon", classes: "bg-type-dragon text-white" },
  dark: { numero: 17, libelle: "Ténèbres", classes: "bg-type-dark text-white" },
  steel: { numero: 9, libelle: "Acier", classes: "bg-type-steel text-gray-950" },
  fairy: { numero: 18, libelle: "Fée", classes: "bg-type-fairy text-gray-950" },
} as const;

export type NomType = keyof typeof TYPES;

export const NOMS_TYPES = Object.keys(TYPES) as NomType[];

export function estUnType(valeur: unknown): valeur is NomType {
  return typeof valeur === "string" && valeur in TYPES;
}

/** Icône officielle du type (Écarlate et Violet), fournie par la PokéAPI. */
export function iconeType(type: NomType): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/${TYPES[type].numero}.png`;
}

export const LIBELLES_STATS: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé.",
  "special-defense": "Déf. Spé.",
  speed: "Vitesse",
};
