/**
 * La console vit sur sa propre page, servie avec des en-têtes d'isolation (voir next.config.ts).
 * Ces en-têtes ne s'appliquent qu'à un VRAI chargement de page : on n'y va donc pas avec
 * router.push (navigation côté client) mais avec un chargement complet.
 */
export const ADRESSE_CONSOLE = "/console";

export function ouvrirConsole() {
  // Volontaire : router.push garderait la page actuelle, sans les en-têtes d'isolation.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(ADRESSE_CONSOLE);
}
