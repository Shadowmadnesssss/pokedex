export default function PiedDePage() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
      Données :{" "}
      <a
        href="https://pokeapi.co"
        className="font-semibold underline underline-offset-2 hover:text-accent"
        target="_blank"
        rel="noreferrer"
      >
        PokéAPI
      </a>
      . Pokémon est une marque de Nintendo, Game Freak et The Pokémon Company. Projet pédagogique.
    </footer>
  );
}
