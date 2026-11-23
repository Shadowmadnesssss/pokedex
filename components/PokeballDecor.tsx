/** Contour de Poké Ball purement décoratif, qui prend la couleur du texte (currentColor). */
export default function PokeballDecor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="7">
        <circle cx="50" cy="50" r="44" />
        <path d="M6 50h29M65 50h29" />
        <circle cx="50" cy="50" r="14" />
      </g>
    </svg>
  );
}
