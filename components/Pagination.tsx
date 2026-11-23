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
  "border-white/10 bg-white/[0.03] text-gray-200 hover:border-accent/60 hover:text-accent";
const INACTIF =
  "cursor-not-allowed border-white/5 text-gray-600";

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
