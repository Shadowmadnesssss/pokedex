import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type CSSProperties, type ReactNode } from "react";
import BadgeType from "@/components/BadgeType";
import BarresStats from "@/components/BarresStats";
import BoutonFavori from "@/components/BoutonFavori";
import BoutonSacoche from "@/components/BoutonSacoche";
import Faiblesses from "@/components/Faiblesses";
import ImagePokemon from "@/components/ImagePokemon";
import PokeballDecor from "@/components/PokeballDecor";
import RadarStats from "@/components/RadarStats";
import { SqueletteFiche } from "@/components/Squelettes";
import VisuelsPokemon from "@/components/VisuelsPokemon";
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
    description:
      pokemon.description ??
      `${pokemon.nomFr} (${formaterNumero(pokemon.id)}) : types, statistiques et évolutions.`,
  };
}

export default function PagePokemon({ params }: Props) {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-block rounded text-sm font-semibold text-gray-400 hover:text-accent"
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
  const numero = formaterNumero(pokemon.id);

  return (
    <article style={teinte} className="space-y-8">
      {/* ---------- Bandeau « héros » aux couleurs du type principal ---------- */}
      <section className="verre relative overflow-hidden rounded-3xl border px-6 py-8 sm:px-10 sm:py-12">
        {/* Lueur du type derrière le Pokémon, filet doré en haut */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,var(--teinte),transparent_60%)] opacity-30 max-md:bg-[radial-gradient(ellipse_at_50%_25%,var(--teinte),transparent_60%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent"
        />
        <PokeballDecor className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 text-white/[0.04]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 left-2 select-none font-display text-[8rem] font-semibold italic leading-none text-white/[0.04] sm:text-[12rem]"
        >
          {numero}
        </span>

        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="order-2 space-y-4 md:order-1">
            <div className="space-y-1">
              <p className="surtitre">N° {numero.slice(1)}</p>
              <div className="flex items-center gap-3">
                <h1 className="min-w-0 break-words font-display text-5xl font-semibold leading-none text-gray-50 sm:text-7xl">
                  {pokemon.nomFr}
                </h1>
                <div className="shrink-0">
                  <BoutonFavori nom={pokemon.nom} nomAffiche={pokemon.nomFr} grand />
                </div>
              </div>
              <p className="pt-1 text-gray-300">
                {pokemon.categorie}
                {pokemon.nomFr.toLowerCase() !== pokemon.nom && (
                  <span className="text-gray-500"> · {capitaliser(pokemon.nom)} en anglais</span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {pokemon.types.map((t) => (
                <BadgeType key={t} type={t} taille="md" icone />
              ))}
            </div>

            {pokemon.description && (
              <blockquote className="max-w-prose border-l border-accent/50 pl-5 font-display text-xl italic leading-relaxed text-gray-200 sm:text-2xl">
                {pokemon.description}
              </blockquote>
            )}

            <dl className="flex flex-wrap gap-3">
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
          </div>

          <div className="order-1 md:order-2">
            <VisuelsPokemon
              pokemon={{ id: pokemon.id, nomFr: pokemon.nomFr, image: pokemon.image, visuels: pokemon.visuels }}
            />
          </div>
        </div>
      </section>

      {/* ---------- Statistiques et faiblesses ---------- */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panneau id="titre-stats" titre="Statistiques de base">
          <div className="grid items-center gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <RadarStats
              series={[{ nom: pokemon.nomFr, stats: pokemon.stats, couleur: "var(--teinte)" }]}
            />
            <BarresStats stats={pokemon.stats} />
          </div>
          <Link
            href={`/comparer?a=${pokemon.nom}`}
            className="inline-block rounded text-sm font-semibold text-accent underline-offset-2 hover:underline"
          >
            Comparer avec un autre Pokémon →
          </Link>
        </Panneau>

        <Panneau id="titre-faiblesses" titre="Faiblesses et résistances">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dégâts subis par {pokemon.nomFr} selon le type de l’attaque.
          </p>
          <Suspense fallback={<div className="squelette h-32 rounded-xl" />}>
            <Faiblesses types={pokemon.types} />
          </Suspense>
        </Panneau>
      </div>

      <Suspense fallback={<div className="squelette h-40 rounded-3xl" />}>
        <Evolutions pokemon={pokemon} />
      </Suspense>
    </article>
  );
}

function Panneau({ id, titre, children }: { id: string; titre: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={id}
      className="space-y-4 rounded-3xl border p-6 verre"
    >
      <h2 id={id} className="font-display text-2xl font-semibold text-gray-50">
        {titre}
      </h2>
      {children}
    </section>
  );
}

function Mesure({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="min-w-28 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 backdrop-blur">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">{libelle}</dt>
      <dd className="text-lg font-bold">{valeur}</dd>
    </div>
  );
}

async function Evolutions({ pokemon }: { pokemon: Pokemon }) {
  const evolutions = await recupererEvolutions(pokemon.urlEspece);
  return (
    <Panneau id="titre-evolutions" titre="Évolutions">
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
                      ? "border-accent/50 bg-accent/[0.07]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  <ImagePokemon src={evo.image} alt={evo.nomFr} taille={80} className="h-20 w-20" />
                  <span className="font-display text-lg font-semibold">{evo.nomFr}</span>
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                    {formaterNumero(evo.id)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Panneau>
  );
}
