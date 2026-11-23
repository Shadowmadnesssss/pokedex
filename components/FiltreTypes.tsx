import Link from "next/link";
import { adresseListe } from "@/lib/recherche";
import { NOMS_TYPES, TYPES, type NomType } from "@/lib/types-pokemon";

type Props = { q: string; type: NomType | null };

/** Composant serveur, sans JavaScript côté navigateur : un état rangé dans l'adresse se modifie avec un lien. */
export default function FiltreTypes({ q, type }: Props) {
  const base =
    "rounded-full px-3 py-1 text-sm font-semibold transition ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950";
  return (
    <nav aria-label="Filtrer par type">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={adresseListe({ q })}
            aria-current={type === null ? "page" : undefined}
            className={`${base} inline-block ${
              type === null
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Tous
          </Link>
        </li>
        {NOMS_TYPES.map((t) => {
          const actif = t === type;
          return (
            <li key={t}>
              <Link
                // Cliquer sur le type actif le désactive
                href={adresseListe({ q, type: actif ? null : t })}
                aria-current={actif ? "page" : undefined}
                className={`${base} inline-block ${TYPES[t].classes} ${
                  actif ? "ring-2 ring-gray-900 dark:ring-white" : "opacity-80 hover:opacity-100"
                }`}
              >
                {TYPES[t].libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
