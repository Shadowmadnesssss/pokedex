import Link from "next/link";
import { adresseListe } from "@/lib/recherche";

type Props = {
  pageCourante: number;
  nombrePages: number;
  q: string;
  type: string | null;
};

const BOUTON =
  "inline-flex min-w-28 justify-center rounded-full border px-4 py-2 text-sm font-semibold transition";
const ACTIF =
  "border-gray-300 bg-white hover:border-accent hover:text-accent dark:border-gray-700 dark:bg-gray-900";
const INACTIF =
  "cursor-not-allowed border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-500";

export default function Pagination({ pageCourante, nombrePages, q, type }: Props) {
  if (nombrePages <= 1) return null; // rien à paginer : on n'affiche rien

  const precedente = pageCourante > 1 ? adresseListe({ q, type, page: pageCourante - 1 }) : null;
  const suivante =
    pageCourante < nombrePages ? adresseListe({ q, type, page: pageCourante + 1 }) : null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-4">
      {precedente ? (
        <Link href={precedente} className={`${BOUTON} ${ACTIF}`} rel="prev">
          ← Précédent
        </Link>
      ) : (
        <span aria-disabled="true" className={`${BOUTON} ${INACTIF}`}>
          ← Précédent
        </span>
      )}
      <p className="text-sm tabular-nums text-gray-700 dark:text-gray-300">
        Page {pageCourante} / {nombrePages}
      </p>
      {suivante ? (
        <Link href={suivante} className={`${BOUTON} ${ACTIF}`} rel="next">
          Suivant →
        </Link>
      ) : (
        <span aria-disabled="true" className={`${BOUTON} ${INACTIF}`}>
          Suivant →
        </span>
      )}
    </nav>
  );
}
