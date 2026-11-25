"use client";

import { useRef } from "react";
import BoutonConsole from "@/components/console/BoutonConsole";
import { useEmulateur } from "@/hooks/useEmulateur";

const EXTENSIONS = ".gb,.gbc,.gba";

/** Console portable : écran, croix directionnelle, boutons, et étagère à cartouches. */
export default function Console() {
  const { canvas, etat, lancer, inserer, ejecter, appuyer, relacher, reveillerSon } = useEmulateur();
  const champ = useRef<HTMLInputElement>(null);
  const pret = etat.statut === "pret";
  const enCours = pret ? etat.enCours : null;
  const touches = { appuyer, relacher, actif: enCours !== null };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[auto_1fr]">
      {/* ---------- La console ---------- */}
      <div
        onPointerDown={reveillerSon}
        className="mx-auto w-full max-w-sm select-none rounded-[1.75rem] rounded-br-[4.5rem] border border-white/10 bg-linear-to-b from-gray-800 to-gray-900 p-5 pb-10 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)]"
      >
        {/* Cadre de l'écran */}
        <div className="rounded-xl rounded-br-[2.5rem] bg-gray-950 p-4 pb-6 shadow-inner">
          <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-gray-500">
            <span
              aria-hidden="true"
              className={`h-2 w-2 rounded-full ${enCours ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-gray-700"}`}
            />
            {enCours ? "En marche" : "Veille"}
          </div>
          <div className="relative aspect-[10/9] overflow-hidden rounded-sm bg-[#0f1a0f]">
            <canvas
              ref={canvas}
              // L'id « canvas » est celui que la couche SDL d'Emscripten s'attend à trouver.
              id="canvas"
              width={160}
              height={144}
              aria-label={enCours ? `Écran de jeu : ${enCours}` : "Écran de la console, éteint"}
              className="h-full w-full object-contain [image-rendering:pixelated]"
              onContextMenu={(e) => e.preventDefault()}
            />
            {!enCours && (
              <div className="absolute inset-0 grid place-items-center p-4 text-center font-mono text-xs leading-relaxed text-[#8bac0f]">
                <EcranVeille etat={etat} />
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 font-display text-lg font-semibold italic tracking-wide text-accent/80">
          Pokédex <span className="text-xs not-italic tracking-[0.3em] text-gray-500">CONSOLE</span>
        </p>

        {/* Commandes */}
        <div className="mt-6 flex items-center justify-between px-1">
          <Croix {...touches} />
          <div className="flex -rotate-[25deg] gap-4 pt-2">
            <BoutonConsole bouton="B" libelle="B" forme="rond" {...touches} />
            <div className="-translate-y-5">
              <BoutonConsole bouton="A" libelle="A" forme="rond" {...touches} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-5">
          <BoutonConsole bouton="Select" libelle="Select" forme="pilule" {...touches} />
          <BoutonConsole bouton="Start" libelle="Start" forme="pilule" {...touches} />
        </div>
      </div>

      {/* ---------- Étagère à cartouches ---------- */}
      <section aria-labelledby="titre-cartouches" className="verre space-y-5 rounded-3xl border p-6">
        <h2 id="titre-cartouches" className="font-display text-2xl font-semibold text-gray-50">
          Cartouches
        </h2>

        <input
          ref={champ}
          type="file"
          accept={EXTENSIONS}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const fichier = e.target.files?.[0];
            if (fichier) inserer(fichier);
            e.target.value = ""; // permet de réinsérer le même fichier
          }}
        />
        <button
          type="button"
          disabled={!pret}
          onClick={() => champ.current?.click()}
          className="bouton-or rounded-full px-5 py-2.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Insérer une cartouche
        </button>
        <p className="text-sm text-gray-400">
          Fichiers <code className="text-gray-300">.gb</code>, <code className="text-gray-300">.gbc</code> ou{" "}
          <code className="text-gray-300">.gba</code>. La cartouche est gardée dans ce navigateur (IndexedDB) :
          rien n’est envoyé sur Internet, et elle sera encore là à votre prochaine visite.
        </p>

        {pret && etat.erreur && (
          <p role="alert" className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {etat.erreur}
          </p>
        )}

        {pret && etat.cartouches.length > 0 && (
          <ul className="space-y-2">
            {etat.cartouches.map((nom) => {
              const active = nom === enCours;
              return (
                <li
                  key={nom}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                    active ? "border-accent/50 bg-accent/[0.07]" : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <span aria-hidden="true" className="text-lg">
                    ▣
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">{nom}</span>
                  <button
                    type="button"
                    onClick={() => lancer(nom)}
                    className="rounded-full px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/10"
                  >
                    {active ? "Redémarrer" : "Jouer"}
                    <span className="sr-only"> {nom}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => ejecter(nom)}
                    className="rounded-full px-3 py-1 text-sm font-semibold text-gray-400 hover:text-rose-300"
                  >
                    Éjecter<span className="sr-only"> {nom}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="space-y-2 border-t border-white/[0.08] pt-4">
          <h3 className="surtitre">Clavier</h3>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-gray-400">
            <Touche clavier="← ↑ → ↓" role="Croix directionnelle" />
            <Touche clavier="X" role="Bouton A" />
            <Touche clavier="Z" role="Bouton B" />
            <Touche clavier="Entrée" role="Start" />
            <Touche clavier="Retour arrière" role="Select" />
          </dl>
          <p className="text-xs text-gray-500">
            La partie est sauvegardée automatiquement toutes les 30 secondes et quand vous quittez la page.
          </p>
        </div>
      </section>
    </div>
  );
}

function EcranVeille({ etat }: { etat: ReturnType<typeof useEmulateur>["etat"] }) {
  switch (etat.statut) {
    case "chargement":
      return <p role="status">Démarrage…</p>;
    case "non-isole":
      return (
        <div className="space-y-2">
          <p>La console doit être ouverte dans un nouvel onglet.</p>
          <button type="button" onClick={() => window.location.reload()} className="underline">
            Recharger
          </button>
        </div>
      );
    case "erreur":
      return <p role="alert">Erreur : {etat.message}</p>;
    case "pret":
      return <p>{etat.cartouches.length > 0 ? "Choisissez une cartouche" : "Insérez une cartouche"}</p>;
  }
}

function Croix(props: { appuyer: (b: string) => void; relacher: (b: string) => void; actif: boolean }) {
  return (
    <div className="grid h-28 w-28 grid-cols-3 grid-rows-3">
      <BoutonConsole bouton="Up" libelle="Haut" forme="croix" className="col-start-2 rounded-t-md" {...props} />
      <BoutonConsole bouton="Left" libelle="Gauche" forme="croix" className="col-start-1 row-start-2 rounded-l-md" {...props} />
      <span aria-hidden="true" className="col-start-2 row-start-2 bg-gray-950" />
      <BoutonConsole bouton="Right" libelle="Droite" forme="croix" className="col-start-3 row-start-2 rounded-r-md" {...props} />
      <BoutonConsole bouton="Down" libelle="Bas" forme="croix" className="col-start-2 row-start-3 rounded-b-md" {...props} />
    </div>
  );
}

function Touche({ clavier, role }: { clavier: string; role: string }) {
  return (
    <>
      <dt>
        <kbd className="rounded border border-white/15 px-1.5 font-mono text-xs text-gray-200">{clavier}</kbd>
      </dt>
      <dd>{role}</dd>
    </>
  );
}
