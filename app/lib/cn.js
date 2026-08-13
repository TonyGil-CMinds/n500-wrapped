/** Une clases condicionales sin dependencias externas. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
