import { CLASSES_GRILLE } from "@/components/GrillePokemon";

const BLOC = "animate-pulse rounded bg-gray-200 motion-reduce:animate-none dark:bg-gray-800";

/** Des blocs gris à la forme du contenu à venir : la page ne « saute » pas. */
export function SqueletteGrille({ nombre = 24 }: { nombre?: number }) {
  return (
    <div role="status" aria-label="Chargement des Pokémon">
      <ul className={CLASSES_GRILLE} aria-hidden="true">
        {Array.from({ length: nombre }, (_, i) => (
          <li
            key={i}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 pb-4 pt-8 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className={`${BLOC} h-28 w-28 rounded-full sm:h-32 sm:w-32`} />
            <div className={`${BLOC} h-3 w-10`} />
            <div className={`${BLOC} h-4 w-24`} />
            <div className={`${BLOC} h-4 w-16 rounded-full`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SqueletteFiltres() {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: 19 }, (_, i) => (
        <div key={i} className={`${BLOC} h-7 w-16 rounded-full`} />
      ))}
    </div>
  );
}

export function SqueletteFiche() {
  return (
    <div role="status" aria-label="Chargement de la fiche" className="grid gap-8 md:grid-cols-2">
      <div className={`${BLOC} aspect-square w-full max-w-sm justify-self-center rounded-3xl`} />
      <div className="space-y-4">
        <div className={`${BLOC} h-4 w-16`} />
        <div className={`${BLOC} h-9 w-48`} />
        <div className={`${BLOC} h-6 w-32 rounded-full`} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${BLOC} h-4 w-full`} />
        ))}
      </div>
    </div>
  );
}
