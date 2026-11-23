import { LIBELLES_STATS } from "@/lib/types-pokemon";
import type { Statistique } from "@/types/pokemon";

const MAX_STAT = 255;

function couleur(valeur: number): string {
  if (valeur >= 120) return "bg-emerald-500";
  if (valeur >= 90) return "bg-lime-500";
  if (valeur >= 60) return "bg-amber-400";
  return "bg-orange-500";
}

export default function BarresStats({ stats }: { stats: Statistique[] }) {
  const total = stats.reduce((somme, s) => somme + s.valeur, 0);
  return (
    <dl className="space-y-2">
      {stats.map((s, i) => (
        <div key={s.cle} className="grid grid-cols-[6rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-sm text-gray-700 dark:text-gray-300">{LIBELLES_STATS[s.cle] ?? s.cle}</dt>
          <dd className="text-right font-mono text-sm font-semibold tabular-nums">{s.valeur}</dd>
          <dd aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            {/*
              Largeur calculée, différente pour chaque stat : le cas légitime d'un attribut style.
              La barre se remplit (scaleX de 0 à 1), avec un léger décalage d'une stat à l'autre.
            */}
            <div
              className={`h-full origin-left animate-remplir rounded-full motion-reduce:animate-none ${couleur(s.valeur)}`}
              style={{
                width: `${Math.min(100, (s.valeur / MAX_STAT) * 100)}%`,
                animationDelay: `${i * 70}ms`,
              }}
            />
          </dd>
        </div>
      ))}
      <div className="grid grid-cols-[6rem_2.5rem_1fr] gap-2 border-t border-gray-200 pt-2 dark:border-gray-800">
        <dt className="text-sm font-semibold">Total</dt>
        <dd className="text-right font-mono text-sm font-bold tabular-nums">{total}</dd>
      </div>
    </dl>
  );
}
