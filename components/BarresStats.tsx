import { LIBELLES_STATS } from "@/lib/types-pokemon";
import type { Statistique } from "@/types/pokemon";

const MAX_STAT = 255;

/** Code « médaille » : or pour les meilleures stats, argent puis bronze terne pour les autres. */
function couleur(valeur: number): string {
  if (valeur >= 120) return "bg-linear-to-r from-accent to-accent-clair shadow-[0_0_12px_rgb(212_178_106/0.5)]";
  if (valeur >= 90) return "bg-accent/70";
  if (valeur >= 60) return "bg-gray-300";
  return "bg-gray-500";
}

export default function BarresStats({ stats }: { stats: Statistique[] }) {
  const total = stats.reduce((somme, s) => somme + s.valeur, 0);
  return (
    <dl className="space-y-2">
      {stats.map((s, i) => (
        <div key={s.cle} className="grid grid-cols-[6rem_2.5rem_1fr] items-center gap-2">
          <dt className="text-sm text-gray-400">{LIBELLES_STATS[s.cle] ?? s.cle}</dt>
          <dd className="text-right font-mono text-sm font-semibold tabular-nums">{s.valeur}</dd>
          <dd aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
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
      <div className="grid grid-cols-[6rem_2.5rem_1fr] gap-2 border-t border-white/[0.08] pt-2">
        <dt className="text-sm font-semibold">Total</dt>
        <dd className="text-right font-mono text-sm font-bold tabular-nums text-accent">{total}</dd>
      </div>
    </dl>
  );
}
