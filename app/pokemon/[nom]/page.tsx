import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties } from "react";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import ImagePokemon from "@/components/ImagePokemon";
import { SqueletteFiche } from "@/components/Squelettes";
import { capitaliser, formaterNumero } from "@/lib/conversion";
import { recupererEvolutions, recupererPokemon, recupererTousLesNoms } from "@/lib/pokeapi";
import type { Pokemon } from "@/types/pokemon";

type Props = PageProps<"/pokemon/[nom]">;

/** Les 151 premiers Pokémon sont construits dès la mise en production. */
export async function generateStaticParams() {
  const tous = await recupererTousLesNoms();
  return tous.slice(0, 151).map((p) => ({ nom: p.nom }));
}

/** Le titre dépend des données. Grâce au cache, l'API n'est interrogée qu'une fois. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  if (!pokemon) return { title: "Introuvable" };
  return {
    title: pokemon.nomFr,
    description: `${pokemon.nomFr} (${formaterNumero(pokemon.id)}) : types, statistiques et évolutions.`,
  };
}

export default function PagePokemon({ params }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-block rounded text-sm font-semibold text-gray-600 hover:text-accent dark:text-gray-400"
      >
        ← Retour à la liste
      </Link>
      <Suspense fallback={<SqueletteFiche />}>
        <Fiche params={params} />
      </Suspense>
    </div>
  );
}

async function Fiche({ params }: { params: Props["params"] }) {
  const { nom } = await params;
  const pokemon = await recupererPokemon(nom);
  // Un nom inconnu n'est pas une panne : c'est un 404.
  if (!pokemon) notFound();

  const teinte = { "--teinte": `var(--color-type-${pokemon.types[0]})` } as CSSProperties;

  return (
    <article className="space-y-10">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div
          style={teinte}
          className="relative flex aspect-square w-full max-w-md items-center justify-center justify-self-center overflow-hidden rounded-3xl bg-linear-to-br from-(--teinte)/40 to-(--teinte)/5"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-4 select-none text-7xl font-black text-gray-900/10 dark:text-white/10"
          >
            {formaterNumero(pokemon.id)}
          </span>
          <ImagePokemon
            src={pokemon.image}
            alt={`Illustration officielle de ${pokemon.nomFr}`}
            taille={400}
            sizes="(min-width: 768px) 400px, 85vw"
            preload
            className="relative h-auto w-4/5 drop-shadow-2xl"
          />
        </div>

        <div className="space-y-6">
          <header className="space-y-2">
            <p className="font-mono text-gray-600 dark:text-gray-400">{formaterNumero(pokemon.id)}</p>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">{pokemon.nomFr}</h1>
              <BoutonFavori nom={pokemon.nom} nomAffiche={pokemon.nomFr} grand />
            </div>
            {pokemon.nomFr.toLowerCase() !== pokemon.nom && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nom anglais : {capitaliser(pokemon.nom)}
              </p>
            )}
            <div className="flex gap-2">
              {pokemon.types.map((t) => (
                <BadgeType key={t} type={t} taille="md" />
              ))}
            </div>
          </header>

          <dl className="grid grid-cols-2 gap-3">
            <Mesure libelle="Taille" valeur={`${pokemon.taille.toLocaleString("fr-FR")} m`} />
            <Mesure libelle="Poids" valeur={`${pokemon.poids.toLocaleString("fr-FR")} kg`} />
          </dl>

          <BoutonSacoche
            pokemon={{
              id: pokemon.id,
              nom: pokemon.nom,
              nomFr: pokemon.nomFr,
              image: pokemon.image,
              types: pokemon.types,
            }}
          />

          <section aria-labelledby="titre-stats" className="space-y-3">
            <h2 id="titre-stats" className="text-xl font-bold">
              Statistiques de base
            </h2>
            <BarresStats stats={pokemon.stats} />
          </section>

          <Link
            href={`/comparer?a=${pokemon.nom}`}
            className="inline-block rounded text-sm font-semibold text-accent underline-offset-2 hover:underline"
          >
            Comparer avec un autre Pokémon →
          </Link>
        </div>
      </div>

      <Suspense fallback={<p className="text-gray-600 dark:text-gray-400">Chargement des évolutions…</p>}>
        <Evolutions pokemon={pokemon} />
      </Suspense>
    </article>
  );
}

function Mesure({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <dt className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">{libelle}</dt>
      <dd className="text-lg font-bold">{valeur}</dd>
    </div>
  );
}

async function Evolutions({ pokemon }: { pokemon: Pokemon }) {
  const evolutions = await recupererEvolutions(pokemon.urlEspece);
  return (
    <section aria-labelledby="titre-evolutions" className="space-y-4">
      <h2 id="titre-evolutions" className="text-xl font-bold">
        Évolutions
      </h2>
      {evolutions.length <= 1 ? (
        <p className="text-gray-600 dark:text-gray-400">{pokemon.nomFr} n’évolue pas.</p>
      ) : (
        <ol className="flex flex-wrap items-center gap-2">
          {evolutions.map((evo, i) => {
            const courant = evo.id === pokemon.id;
            return (
              <li key={evo.id} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-2xl text-gray-400">
                    →
                  </span>
                )}
                <Link
                  href={`/pokemon/${evo.nom}`}
                  aria-current={courant ? "page" : undefined}
                  className={`flex w-28 flex-col items-center rounded-2xl border p-2 text-center transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0 ${
                    courant
                      ? "border-accent bg-red-50 dark:bg-red-950/40"
                      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <ImagePokemon src={evo.image} alt={evo.nomFr} taille={80} className="h-20 w-20" />
                  <span className="text-sm font-semibold">{evo.nomFr}</span>
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {formaterNumero(evo.id)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
