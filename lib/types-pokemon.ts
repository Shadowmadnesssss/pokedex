/**
 * Table de correspondance des 18 types.
 * Badges translucides : un voile de la couleur du type, un filet de la même couleur, texte clair.
 * Les classes sont écrites EN ENTIER : Tailwind ne génère que les classes
 * qu'il lit telles quelles dans le code (`bg-type-${t}` ne marcherait pas).
 * La donnée reste en anglais ; on ne traduit qu'à l'affichage.
 * `numero` est l'identifiant du type dans la PokéAPI : il sert à trouver son icône.
 */
export const TYPES = {
  normal: { numero: 1, libelle: "Normal", classes: "bg-type-normal/20 text-gray-50 ring-1 ring-inset ring-type-normal/50" },
  fire: { numero: 10, libelle: "Feu", classes: "bg-type-fire/20 text-gray-50 ring-1 ring-inset ring-type-fire/50" },
  water: { numero: 11, libelle: "Eau", classes: "bg-type-water/20 text-gray-50 ring-1 ring-inset ring-type-water/50" },
  electric: { numero: 13, libelle: "Électrik", classes: "bg-type-electric/20 text-gray-50 ring-1 ring-inset ring-type-electric/50" },
  grass: { numero: 12, libelle: "Plante", classes: "bg-type-grass/20 text-gray-50 ring-1 ring-inset ring-type-grass/50" },
  ice: { numero: 15, libelle: "Glace", classes: "bg-type-ice/20 text-gray-50 ring-1 ring-inset ring-type-ice/50" },
  fighting: { numero: 2, libelle: "Combat", classes: "bg-type-fighting/20 text-gray-50 ring-1 ring-inset ring-type-fighting/50" },
  poison: { numero: 4, libelle: "Poison", classes: "bg-type-poison/20 text-gray-50 ring-1 ring-inset ring-type-poison/50" },
  ground: { numero: 5, libelle: "Sol", classes: "bg-type-ground/20 text-gray-50 ring-1 ring-inset ring-type-ground/50" },
  flying: { numero: 3, libelle: "Vol", classes: "bg-type-flying/20 text-gray-50 ring-1 ring-inset ring-type-flying/50" },
  psychic: { numero: 14, libelle: "Psy", classes: "bg-type-psychic/20 text-gray-50 ring-1 ring-inset ring-type-psychic/50" },
  bug: { numero: 7, libelle: "Insecte", classes: "bg-type-bug/20 text-gray-50 ring-1 ring-inset ring-type-bug/50" },
  rock: { numero: 6, libelle: "Roche", classes: "bg-type-rock/20 text-gray-50 ring-1 ring-inset ring-type-rock/50" },
  ghost: { numero: 8, libelle: "Spectre", classes: "bg-type-ghost/20 text-gray-50 ring-1 ring-inset ring-type-ghost/50" },
  dragon: { numero: 16, libelle: "Dragon", classes: "bg-type-dragon/20 text-gray-50 ring-1 ring-inset ring-type-dragon/50" },
  dark: { numero: 17, libelle: "Ténèbres", classes: "bg-type-dark/20 text-gray-50 ring-1 ring-inset ring-type-dark/50" },
  steel: { numero: 9, libelle: "Acier", classes: "bg-type-steel/20 text-gray-50 ring-1 ring-inset ring-type-steel/50" },
  fairy: { numero: 18, libelle: "Fée", classes: "bg-type-fairy/20 text-gray-50 ring-1 ring-inset ring-type-fairy/50" },
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
