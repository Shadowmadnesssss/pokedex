import { cacheLife } from "next/cache";
import { appeler, chargerPokemon, TOTAL_POKEMON } from "@/lib/chargement";
import { aplatir, idDepuisUrl } from "@/lib/conversion";

const GRAPHQL = "https://graphql.pokeapi.co/v1beta2";
import type { NomType } from "@/lib/types-pokemon";
import type {
  ChaineApi,
  EspeceApi,
  ListeApi,
  Pokemon,
  ReferencePokemon,
  TypeApi,
} from "@/types/pokemon";

/*
  Couche d'accès aux données côté serveur.
  Chaque fonction est mise en cache plusieurs jours : les données d'un Pokémon
  ne changent presque jamais, et la PokéAPI demande de ne pas la bombarder.
*/

export async function recupererPokemon(nomOuId: string | number): Promise<Pokemon | null> {
  "use cache";
  cacheLife("days");
  return chargerPokemon(nomOuId);
}

/** Charge le détail de plusieurs Pokémon en parallèle. */
export async function recupererPlusieurs(noms: string[]): Promise<Pokemon[]> {
  const resultats = await Promise.all(noms.map((n) => recupererPokemon(n)));
  return resultats.filter((p): p is Pokemon => p !== null);
}

/** Les 1 025 noms et numéros : sert à la recherche, au tirage au sort et au comparateur. */
export async function recupererTousLesNoms(): Promise<ReferencePokemon[]> {
  "use cache";
  cacheLife("days");
  const [liste, nomsFr] = await Promise.all([
    appeler<ListeApi>(`/pokemon?limit=${TOTAL_POKEMON}&offset=0`),
    recupererNomsFrancais(),
  ]);
  if (!liste) throw new Error("Liste des Pokémon introuvable");
  return liste.results.map((r) => {
    const id = idDepuisUrl(r.url);
    return { nom: r.name, id, nomFr: nomsFr[id] };
  });
}

/**
 * Bonus : les 1 025 noms français en UNE requête, grâce à l'API GraphQL de la PokéAPI
 * (l'API REST demanderait 1 025 appels à /pokemon-species).
 * Si elle ne répond pas, la recherche fonctionne quand même avec les noms anglais.
 */
async function recupererNomsFrancais(): Promise<Record<number, string>> {
  try {
    const reponse = await fetch(GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "{ pokemonspeciesname(where: {language_id: {_eq: 5}}) { name pokemon_species_id } }",
      }),
    });
    if (!reponse.ok) return {};
    const json = (await reponse.json()) as {
      data?: { pokemonspeciesname: { name: string; pokemon_species_id: number }[] };
    };
    return Object.fromEntries(
      (json.data?.pokemonspeciesname ?? []).map((n) => [n.pokemon_species_id, n.name]),
    );
  } catch {
    return {};
  }
}

/** Tous les Pokémon d'un type, triés par numéro, sans les formes alternatives. */
export async function recupererParType(type: NomType): Promise<ReferencePokemon[]> {
  "use cache";
  cacheLife("days");
  const donnees = await appeler<TypeApi>(`/type/${type}`);
  if (!donnees) return [];
  return donnees.pokemon
    .map(({ pokemon }) => ({ nom: pokemon.name, id: idDepuisUrl(pokemon.url) }))
    .filter((p) => p.id <= TOTAL_POKEMON)
    .sort((a, b) => a.id - b.id);
}

/** Chaîne d'évolution : l'espèce donne l'adresse de la chaîne, puis on aplatit l'arbre. */
export async function recupererEvolutions(urlEspece: string): Promise<Pokemon[]> {
  "use cache";
  cacheLife("days");
  const espece = await appeler<EspeceApi>(urlEspece);
  if (!espece?.evolution_chain) return [];
  const chaine = await appeler<ChaineApi>(espece.evolution_chain.url);
  if (!chaine) return [];
  // On charge par numéro d'espèce : le nom d'espèce ("deoxys") n'est pas toujours un nom de Pokémon.
  return recupererPlusieurs(aplatir(chaine.chain).map((e) => String(e.id)));
}
