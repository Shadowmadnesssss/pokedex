import CartePokemon from "@/components/CartePokemon";
import type { Pokemon } from "@/types/pokemon";

type Props = { pokemons: Pokemon[]; messageVide?: string };

export const CLASSES_GRILLE =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

export default function GrillePokemon({ pokemons, messageVide = "Aucun Pokémon." }: Props) {
  if (pokemons.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
        {messageVide}
      </p>
    );
  }
  return (
    <ul className={CLASSES_GRILLE}>
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <CartePokemon pokemon={pokemon} />
        </li>
      ))}
    </ul>
  );
}
