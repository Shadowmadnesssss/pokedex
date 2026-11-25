"use client";

import type { mGBAEmulator } from "@thenick775/mgba-wasm";
import { useCallback, useEffect, useRef, useState } from "react";

export type EtatEmulateur =
  | { statut: "chargement" }
  | { statut: "non-isole" }
  | { statut: "erreur"; message: string }
  | { statut: "pret"; cartouches: string[]; enCours: string | null; erreur: string | null };

/*
  Le cœur mGBA est servi tel quel depuis public/mgba (copié par scripts/copier-mgba.mjs) :
  on l'importe à l'exécution, sans le passer par le bundler (commentaire webpackIgnore).
  Il n'est téléchargé qu'à l'ouverture de la console.
*/
const ADRESSE_COEUR = "/mgba/mgba.js";

// Une seule instance par canvas : en développement, React monte les effets deux fois.
let instance: { canvas: HTMLCanvasElement; promesse: Promise<mGBAEmulator> } | null = null;

function demarrer(canvas: HTMLCanvasElement): Promise<mGBAEmulator> {
  if (instance?.canvas === canvas) return instance.promesse;
  const promesse = (async () => {
    const { default: mGBA } = (await import(/* webpackIgnore: true */ ADRESSE_COEUR)) as {
      default: (options: { canvas: HTMLCanvasElement }) => Promise<mGBAEmulator>;
    };
    const emulateur = await mGBA({ canvas });
    // Monte le système de fichiers virtuel, sauvegardé dans IndexedDB : c'est là que
    // vivent les cartouches et les sauvegardes, d'une visite à l'autre.
    await emulateur.FSInit();
    // Clavier : flèches, X = A, Z = B, Entrée = Start, Retour arrière = Select
    for (const [touche, bouton] of [
      ["Up", "Up"],
      ["Down", "Down"],
      ["Left", "Left"],
      ["Right", "Right"],
      ["X", "A"],
      ["Z", "B"],
      ["Return", "Start"],
      ["Backspace", "Select"],
    ]) {
      emulateur.bindKey(touche, bouton);
    }
    return emulateur;
  })();
  instance = { canvas, promesse };
  return promesse;
}

/** Pilote l'émulateur : chargement, cartouches mémorisées, boutons. */
export function useEmulateur() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const emulateur = useRef<mGBAEmulator | null>(null);
  const [etat, setEtat] = useState<EtatEmulateur>({ statut: "chargement" });

  const lister = useCallback((enCours: string | null, erreur: string | null = null) => {
    const m = emulateur.current;
    if (!m) return;
    const cartouches = m.listRoms().filter((nom) => nom !== "." && nom !== "..");
    setEtat({ statut: "pret", cartouches, enCours, erreur });
  }, []);

  useEffect(() => {
    // Sans isolation, pas de SharedArrayBuffer : mGBA ne peut pas démarrer.
    if (!window.crossOriginIsolated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- état connu seulement dans le navigateur
      setEtat({ statut: "non-isole" });
      return;
    }
    const element = canvas.current;
    if (!element) return;
    let actif = true;

    // Écrit le système de fichiers dans IndexedDB (sauvegardes du jeu, sauvegardes auto).
    const synchroniser = () => void emulateur.current?.FSSync();

    demarrer(element)
      .then((m) => {
        if (!actif) return;
        emulateur.current = m;
        m.addCoreCallbacks({
          saveDataUpdatedCallback: synchroniser,
          autoSaveStateCapturedCallback: synchroniser,
        });
        lister(null);
      })
      .catch((e: unknown) => {
        if (actif) setEtat({ statut: "erreur", message: e instanceof Error ? e.message : String(e) });
      });

    // En quittant la page, on capture l'état de la partie pour la reprendre plus tard.
    function surDepart() {
      const m = emulateur.current;
      if (!m?.gameName) return;
      m.forceAutoSaveState();
      void m.FSSync();
    }
    window.addEventListener("pagehide", surDepart);

    return () => {
      actif = false;
      window.removeEventListener("pagehide", surDepart);
      surDepart();
      emulateur.current?.pauseGame();
      emulateur.current?.pauseAudio();
    };
  }, [lister]);

  /** Les navigateurs bloquent le son tant que l'utilisateur n'a pas cliqué. */
  const reveillerSon = useCallback(() => {
    void emulateur.current?.SDL2?.audioContext?.resume();
  }, []);

  const lancer = useCallback(
    (nom: string) => {
      const m = emulateur.current;
      if (!m) return;
      reveillerSon();
      const ok = m.loadGame(`${m.filePaths().gamePath}/${nom}`);
      if (ok) {
        m.resumeAudio();
        lister(nom);
      } else {
        // La liste reste affichée : seul ce fichier pose problème.
        lister(null, `Impossible de lire « ${nom} » : ce n’est pas une cartouche valide.`);
      }
    },
    [lister, reveillerSon],
  );

  const inserer = useCallback(
    (fichier: File) => {
      const m = emulateur.current;
      if (!m) return;
      reveillerSon();
      m.uploadRom(fichier, () => {
        // La cartouche est copiée dans le système de fichiers : on la mémorise, puis on la lance.
        void m.FSSync();
        lancer(fichier.name);
      });
    },
    [lancer, reveillerSon],
  );

  const ejecter = useCallback(
    (nom: string) => {
      const m = emulateur.current;
      if (!m) return;
      if (m.gameName?.endsWith(`/${nom}`)) m.quitGame();
      m.FS.unlink(`${m.filePaths().gamePath}/${nom}`);
      void m.FSSync();
      lister(null);
    },
    [lister],
  );

  const appuyer = useCallback((bouton: string) => emulateur.current?.buttonPress(bouton), []);
  const relacher = useCallback((bouton: string) => emulateur.current?.buttonUnpress(bouton), []);

  return { canvas, etat, lancer, inserer, ejecter, appuyer, relacher, reveillerSon };
}
