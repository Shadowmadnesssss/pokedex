import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import BadgeType from "@/components/BadgeType";
import ImagePokemon from "@/components/ImagePokemon";
import RadarStats from "@/components/RadarStats";
import { formaterNumero } from "@/lib/conversion";
import { recupererPokemon, recupererTousLesNoms } from "@/lib/pokeapi";
import { normaliser } from "@/lib/recherche";
import { LIBELLES_STATS } from "@/lib/types-pokemon";
import type { Pokemon, ReferencePokemon } from "@/types/pokemon";

export const metadata: Metadata = { title: "Comparateur" };

type Props = PageProps<"/comparer">;

/** Bonus : deux Pokémon côte à côte. Le choix est rangé dans l'adresse : /comparer?a=pikachu&b=raichu */
export default function PageComparer({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight">Comparateur</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choisissez deux Pokémon (nom français, anglais ou numéro) pour comparer leurs statistiques.
        </p>
      </div>
      <Suspense fallback={<div className="squelette h-24 rounded-2xl" />}>
        <Comparaison searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function premier(v: string | string[] | undefined): string {
  return ((Array.isArray(v) ? v[0] : v) ?? "").trim().slice(0, 40);
}

/** Retrouve un Pokémon d'après ce que l'utilisateur a tapé : nom fr, nom en, ou numéro. */
function resoudre(saisie: string, tous: ReferencePokemon[]): string | null {
  if (!saisie) return null;
  const s = normaliser(saisie).replace(/^#/, "");
  const trouve =
    tous.find((p) => String(p.id) === s.replace(/^0+/, "")) ??
    tous.find((p) => p.nom === s) ??
    tous.find((p) => p.nomFr && normaliser(p.nomFr) === s);
  return trouve ? String(trouve.id) : null;
}

async function Comparaison({ searchParams }: { searchParams: Props["searchParams"] }) {
  const params = await searchParams;
  const saisieA = premier(params.a);
  const saisieB = premier(params.b);
  const tous = await recupererTousLesNoms();
  const charger = (saisie: string) => {
    const id = resoudre(saisie, tous);
    return id ? recupererPokemon(id) : null;
  };
  const [a, b] = await Promise.all([charger(saisieA), charger(saisieB)]);

  return (
    <div className="space-y-8">
      {/* Un simple formulaire GET : il écrit a et b dans l'adresse, sans JavaScript. */}
      <form action="/comparer" className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Champ nom="a" libelle="Premier Pokémon" valeur={a?.nomFr ?? saisieA} erreur={!!saisieA && !a} />
        <Champ nom="b" libelle="Second Pokémon" valeur={b?.nomFr ?? saisieB} erreur={!!saisieB && !b} />
        <button
          type="submit"
          className="h-11 rounded-full bg-accent px-6 font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Comparer
        </button>
        <datalist id="liste-pokemon">
          {tous.map((p) => (
            <option key={p.id} value={p.nomFr ?? p.nom} />
          ))}
        </datalist>
      </form>

      {a && b ? (
        <TableauComparaison a={a} b={b} />
      ) : (
        <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {a || b ? "Choisissez le second Pokémon." : "Exemple : "}
          {!a && !b && (
            <Link href="/comparer?a=dracaufeu&b=tortank" className="font-semibold text-accent underline">
              Dracaufeu contre Tortank
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

function Champ({ nom, libelle, valeur, erreur }: { nom: string; libelle: string; valeur: string; erreur: boolean }) {
  return (
    <div className="space-y-1">
      <label htmlFor={`champ-${nom}`} className="text-sm font-semibold">
        {libelle}
      </label>
      <input
        id={`champ-${nom}`}
        name={nom}
        list="liste-pokemon"
        defaultValue={valeur}
        autoComplete="off"
        aria-invalid={erreur}
        aria-describedby={erreur ? `erreur-${nom}` : undefined}
        className="h-11 w-full rounded-full border border-gray-300 bg-white px-4 dark:border-gray-700 dark:bg-gray-900"
      />
      {erreur && (
        <p id={`erreur-${nom}`} className="text-sm text-red-700 dark:text-red-400">
          Pokémon introuvable.
        </p>
      )}
    </div>
  );
}

function TableauComparaison({ a, b }: { a: Pokemon; b: Pokemon }) {
  const totalA = a.stats.reduce((s, x) => s + x.valeur, 0);
  const totalB = b.stats.reduce((s, x) => s + x.valeur, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[a, b].map((p) => (
          <Link
            key={p.id}
            href={`/pokemon/${p.nom}`}
            className="flex flex-col items-center gap-1 rounded-2xl border border-gray-200 bg-white p-4 text-center transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <ImagePokemon src={p.image} alt={p.nomFr} taille={160} className="h-32 w-32 drop-shadow-lg sm:h-40 sm:w-40" />
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{formaterNumero(p.id)}</span>
            <span className="text-lg font-bold">{p.nomFr}</span>
            <span className="flex gap-1">
              {p.types.map((t) => (
                <BadgeType key={t} type={t} />
              ))}
            </span>
          </Link>
        ))}
      </div>

      <RadarStats
        series={[
          { nom: a.nomFr, stats: a.stats, couleur: `var(--color-type-${a.types[0]})` },
          {
            nom: b.nomFr,
            stats: b.stats,
            // Deux Pokémon du même type : on prend une autre couleur pour les distinguer.
            couleur:
              b.types[0] === a.types[0] ? "var(--color-gray-500)" : `var(--color-type-${b.types[0]})`,
          },
        ]}
      />

      <table className="w-full border-separate border-spacing-y-2 text-sm">
        <caption className="sr-only">
          Statistiques de {a.nomFr} et {b.nomFr}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-2/5 text-right font-semibold">{a.nomFr}</th>
            <th scope="col" className="w-1/5 text-center font-semibold text-gray-600 dark:text-gray-400">Stat</th>
            <th scope="col" className="w-2/5 text-left font-semibold">{b.nomFr}</th>
          </tr>
        </thead>
        <tbody>
          {a.stats.map((sa) => {
            const vb = b.stats.find((sb) => sb.cle === sa.cle)?.valeur ?? 0;
            return (
              <LigneStat key={sa.cle} libelle={LIBELLES_STATS[sa.cle] ?? sa.cle} va={sa.valeur} vb={vb} max={255} />
            );
          })}
          <LigneStat libelle="Total" va={totalA} vb={totalB} max={Math.max(totalA, totalB)} gras />
        </tbody>
      </table>
    </div>
  );
}

function LigneStat({ libelle, va, vb, max, gras = false }: { libelle: string; va: number; vb: number; max: number; gras?: boolean }) {
  const barre = (v: number, gagnant: boolean) => (
    <div
      className={`h-3 rounded-full ${gagnant ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-600"}`}
      style={{ width: `${Math.min(100, (v / max) * 100)}%` }}
    />
  );
  return (
    <tr className={gras ? "font-bold" : undefined}>
      <td>
        <div className="flex items-center justify-end gap-2">
          <span className="font-mono tabular-nums">{va}</span>
          <div className="flex w-full max-w-48 justify-end" aria-hidden="true">{barre(va, va > vb)}</div>
        </div>
      </td>
      <th scope="row" className="text-center font-medium text-gray-700 dark:text-gray-300">{libelle}</th>
      <td>
        <div className="flex items-center gap-2">
          <div className="flex w-full max-w-48" aria-hidden="true">{barre(vb, vb > va)}</div>
          <span className="font-mono tabular-nums">{vb}</span>
        </div>
      </td>
    </tr>
  );
}
