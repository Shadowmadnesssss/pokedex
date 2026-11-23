import Link from "next/link";
import IconeType from "@/components/IconeType";
import { adresseListe } from "@/lib/recherche";
import { NOMS_TYPES, TYPES, type NomType } from "@/lib/types-pokemon";

type Props = { q: string; type: NomType | null };

const PASTILLE =
  "inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-sm font-semibold transition";

/**
 * Composant serveur, sans JavaScript côté navigateur : un état rangé dans l'adresse se modifie avec un lien.
 * Sur téléphone, une seule ligne qu'on fait défiler ; à partir de sm, les pastilles passent à la ligne.
 */
export default function FiltreTypes({ q, type }: Props) {
  return (
    <nav aria-label="Filtrer par type" className="-mx-4 sm:mx-0">
      <ul className="defilement-discret flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <li className="shrink-0">
          <Link
            href={adresseListe({ q })}
            aria-current={type === null ? "page" : undefined}
            className={`${PASTILLE} px-3 ${
              type === null
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-accent/50 hover:text-white"
            }`}
          >
            Tous
          </Link>
        </li>
        {NOMS_TYPES.map((t) => {
          const actif = t === type;
          return (
            <li key={t} className="shrink-0">
              <Link
                // Cliquer sur le type actif le désactive
                href={adresseListe({ q, type: actif ? null : t })}
                aria-current={actif ? "page" : undefined}
                className={`${PASTILLE} ${
                  actif
                    ? `${TYPES[t].classes} border-transparent shadow-[0_0_24px_-6px_rgb(255_255_255/0.35)]`
                    : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-accent/50 hover:text-white"
                }`}
              >
                <IconeType type={t} immediat />
                {TYPES[t].libelle}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
