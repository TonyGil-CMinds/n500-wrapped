/**
 * Datos del destinatario de la experiencia.
 *
 * Placeholder hasta que exista la fuente real (CMS, API o ruta por empresa).
 * `/?empresa=Nombre&usuario=Nombre` permite previsualizar cualquier caso sin
 * tocar el código.
 */
export const defaults = {
  companyName: 'Nombre de Empresa',
  userName: 'Bryan Ruiz',
}

const PHASES = ['welcome', 'story', 'badge']

export function resolveRecipient(searchParams = {}) {
  return {
    companyName: searchParams.empresa || defaults.companyName,
    userName: searchParams.usuario || defaults.userName,
    // `?fase=story` entra directo a esa pantalla, para revisarla sin tener
    // que recorrer la experiencia entera cada vez.
    initialPhase: PHASES.includes(searchParams.fase) ? searchParams.fase : 'welcome',
  }
}
