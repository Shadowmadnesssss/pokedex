"use client";

type Props = {
  bouton: string; // nom attendu par mGBA : "A", "B", "Start", "Select", "Up"...
  libelle: string;
  forme: "rond" | "pilule" | "croix";
  appuyer: (bouton: string) => void;
  relacher: (bouton: string) => void;
  actif: boolean;
  className?: string;
};

const FORMES = {
  rond: "h-14 w-14 rounded-full border border-accent/40 bg-linear-to-b from-gray-700 to-gray-800 text-sm font-bold text-accent shadow-[0_4px_0_rgb(0_0_0/0.5)] active:translate-y-0.5 active:shadow-none",
  pilule:
    "h-3 w-14 rounded-full bg-gray-700 shadow-[0_2px_0_rgb(0_0_0/0.5)] active:translate-y-px active:shadow-none",
  croix: "bg-gray-950 shadow-[0_3px_0_rgb(0_0_0/0.5)] active:bg-black",
};

/**
 * Bouton tactile : on suit le doigt avec les événements « pointer » (souris, toucher, stylet).
 * setPointerCapture garantit qu'on reçoit le relâchement même si le doigt glisse hors du bouton.
 */
export default function BoutonConsole({ bouton, libelle, forme, appuyer, relacher, actif, className = "" }: Props) {
  const element = (
    <button
      type="button"
      aria-label={libelle}
      disabled={!actif}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        appuyer(bouton);
      }}
      onPointerUp={() => relacher(bouton)}
      onPointerCancel={() => relacher(bouton)}
      onLostPointerCapture={() => relacher(bouton)}
      onContextMenu={(e) => e.preventDefault()}
      className={`touch-none transition disabled:cursor-default ${FORMES[forme]} ${className}`}
    >
      {forme === "rond" ? libelle : null}
    </button>
  );
  // Les branches de la croix sont placées directement dans la grille de la croix.
  if (forme === "croix") return element;
  return (
    <div className="flex flex-col items-center gap-1.5">
      {element}
      {forme === "pilule" && (
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">{libelle}</span>
      )}
    </div>
  );
}
