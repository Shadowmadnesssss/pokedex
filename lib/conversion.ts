import type {
  EspeceApi,
  MaillonApi,
  Pokemon,
  PokemonApi,
  ReferencePokemon,
} from "@/types/pokemon";

export function capitaliser(texte: string): string {
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function formaterNumero(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/** Récupère l'identifiant à la fin d'une adresse de l'API : ".../pokemon/25/" → 25 */
export function idDepuisUrl(url: string): number {
  const morceaux = url.split("/").filter(Boolean);
  return Number(morceaux[morceaux.length - 1]);
}

export function nomFrancais(espece: EspeceApi | null): string | null {
  return espece?.names.find((n) => n.language.name === "fr")?.name ?? null;
}

/** Convertit la réponse brute en Pokemon, dans les bonnes unités. */
export function versPokemon(brut: PokemonApi, espece: EspeceApi | null): Pokemon {
  return {
    id: brut.id,
    nom: brut.name,
    nomFr: nomFrancais(espece) ?? capitaliser(brut.name),
    image: brut.sprites.other?.["official-artwork"]?.front_default ?? brut.sprites.front_default,
    visuels: {
      home: brut.sprites.other?.home?.front_default ?? null,
      homeChromatique: brut.sprites.other?.home?.front_shiny ?? null,
      anime: brut.sprites.other?.showdown?.front_default ?? null,
    },
    types: [...brut.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    taille: brut.height / 10,
    poids: brut.weight / 10,
    stats: brut.stats.map((s) => ({ cle: s.stat.name, valeur: s.base_stat })),
    urlEspece: brut.species.url,
  };
}

/**
 * Parcourt l'arbre d'évolution (récursion) et renvoie la liste à plat des espèces.
 * Chaque maillon contient d'autres maillons de même forme, sur une profondeur inconnue.
 */
export function aplatir(maillon: MaillonApi): ReferencePokemon[] {
  const ici = { nom: maillon.species.name, id: idDepuisUrl(maillon.species.url) };
  return [ici, ...maillon.evolves_to.flatMap(aplatir)];
}
