import { CLASSES_GRILLE } from "@/components/GrillePokemon";

/** « squelette » est défini dans globals.css : un bloc gris traversé par un reflet. */
const BLOC = "squelette rounded";

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
            <div className={`${BLOC} mt-1 h-3 w-10`} />
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
    <div className="flex gap-2 overflow-hidden sm:flex-wrap" aria-hidden="true">
      {Array.from({ length: 19 }, (_, i) => (
        <div key={i} className={`${BLOC} h-8 w-20 shrink-0 rounded-full`} />
      ))}
    </div>
  );
}

export function SqueletteFiche() {
  return (
    <div role="status" aria-label="Chargement de la fiche" className="space-y-8">
      <div className="squelette grid h-[28rem] items-center gap-6 rounded-3xl px-6 sm:px-10 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="h-4 w-16 rounded bg-white/40 dark:bg-white/10" />
          <div className="h-12 w-64 rounded bg-white/40 dark:bg-white/10" />
          <div className="h-7 w-40 rounded-full bg-white/40 dark:bg-white/10" />
          <div className="h-16 w-full max-w-prose rounded bg-white/40 dark:bg-white/10" />
        </div>
        <div className="hidden h-72 w-72 rounded-full bg-white/40 md:block dark:bg-white/10" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${BLOC} h-72 rounded-3xl`} />
        <div className={`${BLOC} h-72 rounded-3xl`} />
      </div>
    </div>
  );
}
