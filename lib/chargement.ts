import { versPokemon } from "@/lib/conversion";
import type { EspeceApi, Pokemon, PokemonApi } from "@/types/pokemon";

/**
 * Fonctions réseau sans cache, utilisables côté serveur ET côté navigateur.
 * lib/pokeapi.ts les enveloppe avec "use cache" pour le serveur.
 */

export const API = "https://pokeapi.co/api/v2";

/** Nombre de Pokémon du Pokédex national (on ignore les formes alternatives). */
export const TOTAL_POKEMON = 1025;

/** Un 404 n'est pas une panne : on renvoie null. Tout autre échec lève une erreur. */
export async function appeler<T>(chemin: string): Promise<T | null> {
  const url = chemin.startsWith("http") ? chemin : `${API}${chemin}`;
  const reponse = await fetch(url);
  if (reponse.status === 404) return null;
  if (!reponse.ok) {
    throw new Error(`La PokéAPI a répondu ${reponse.status} pour ${url}`);
  }
  return (await reponse.json()) as T;
}

export async function chargerPokemon(nomOuId: string | number): Promise<Pokemon | null> {
  const cle = String(nomOuId).toLowerCase().trim();
  if (!/^[a-z0-9-]+$/.test(cle)) return null;
  const brut = await appeler<PokemonApi>(`/pokemon/${cle}`);
  if (!brut) return null;
  const espece = await appeler<EspeceApi>(brut.species.url);
  return versPokemon(brut, espece);
}

/** Version navigateur : utilisée par la page Favoris, dont la liste n'existe que dans le navigateur. */
export async function chargerPlusieurs(noms: string[]): Promise<Pokemon[]> {
  const resultats = await Promise.all(noms.map((n) => chargerPokemon(n)));
  return resultats.filter((p): p is Pokemon => p !== null);
}
