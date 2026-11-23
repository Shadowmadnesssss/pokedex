import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  taille: number;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

/** next/image, avec une silhouette de secours quand l'API n'a pas d'illustration. */
export default function ImagePokemon({ src, alt, taille, className = "", sizes, preload }: Props) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ width: taille, height: taille }}
        className={`flex items-center justify-center rounded-full bg-gray-200 text-3xl text-gray-500 dark:bg-gray-800 ${className}`}
      >
        ?
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={taille}
      height={taille}
      sizes={sizes ?? `${taille}px`}
      preload={preload}
      loading={preload ? "eager" : undefined}
      className={className}
    />
  );
}
