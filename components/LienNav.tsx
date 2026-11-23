"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = { href: string; children: ReactNode };

export const CLASSES_LIEN_NAV =
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition";

/** Surligne la page courante grâce à usePathname. */
export default function LienNav({ href, children }: Props) {
  const chemin = usePathname();
  const actif = href === "/" ? chemin === "/" : chemin.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={actif ? "page" : undefined}
      className={`${CLASSES_LIEN_NAV} ${
        actif
          ? "bg-white/20 text-white"
          : "text-red-50 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
