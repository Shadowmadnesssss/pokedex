import { LIBELLES_STATS } from "@/lib/types-pokemon";
import type { Statistique } from "@/types/pokemon";

export type SerieRadar = {
  nom: string;
  stats: Statistique[];
  couleur: string; // une couleur CSS, par exemple "var(--color-type-fire)"
};

/** Ordre habituel autour de l'hexagone, dans le sens des aiguilles d'une montre. */
const AXES = ["hp", "attack", "defense", "speed", "special-defense", "special-attack"];
const MAX = 200; // au-delà (Leuphorie et ses 255 PV), la pointe touche le bord
const CENTRE = { x: 150, y: 135 };
const RAYON = 95;

function point(indice: number, ratio: number) {
  const angle = -Math.PI / 2 + (indice * 2 * Math.PI) / AXES.length;
  return {
    x: CENTRE.x + Math.cos(angle) * RAYON * ratio,
    y: CENTRE.y + Math.sin(angle) * RAYON * ratio,
  };
}

function contour(ratios: number[]) {
  return ratios
    .map((r, i) => point(i, r))
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
}

/**
 * Graphique radar en SVG pur, rendu côté serveur : aucun JavaScript envoyé au navigateur.
 * Une ou deux séries (le comparateur les superpose).
 */
export default function RadarStats({ series }: { series: SerieRadar[] }) {
  const description = series
    .map((s) => `${s.nom} : ${s.stats.map((x) => `${LIBELLES_STATS[x.cle] ?? x.cle} ${x.valeur}`).join(", ")}`)
    .join(". ");

  return (
    <figure className="mx-auto w-full max-w-sm">
      <svg viewBox="0 0 300 270" role="img" aria-label={`Radar des statistiques. ${description}`}>
        {/* Grille : 4 hexagones concentriques et les 6 axes */}
        <g className="stroke-gray-300 dark:stroke-gray-700" fill="none" strokeWidth="1">
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <polygon key={r} points={contour(AXES.map(() => r))} />
          ))}
          {AXES.map((_, i) => {
            const p = point(i, 1);
            return <line key={i} x1={CENTRE.x} y1={CENTRE.y} x2={p.x} y2={p.y} />;
          })}
        </g>

        {series.map((s) => {
          const ratios = AXES.map((cle) => {
            const valeur = s.stats.find((x) => x.cle === cle)?.valeur ?? 0;
            return Math.min(1, valeur / MAX);
          });
          return (
            <g key={s.nom} style={{ color: s.couleur }}>
              <polygon
                points={contour(ratios)}
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {ratios.map((r, i) => {
                const p = point(i, r);
                return <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="currentColor" />;
              })}
            </g>
          );
        })}

        {/* Libellés et valeurs (valeur de la première série) */}
        {AXES.map((cle, i) => {
          const p = point(i, 1.22);
          const valeur = series[0]?.stats.find((x) => x.cle === cle)?.valeur;
          return (
            <text
              key={cle}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-700 text-[11px] font-semibold dark:fill-gray-300"
            >
              {LIBELLES_STATS[cle]}
              {series.length === 1 && valeur !== undefined && (
                <tspan className="fill-gray-950 font-bold dark:fill-white"> {valeur}</tspan>
              )}
            </text>
          );
        })}
      </svg>
      {series.length > 1 && (
        <figcaption className="mt-2 flex justify-center gap-4 text-sm">
          {series.map((s) => (
            <span key={s.nom} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: s.couleur }} />
              {s.nom}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
