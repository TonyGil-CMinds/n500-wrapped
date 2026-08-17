/**
 * Máscara diagonal para descubrir un fondo sin moverlo.
 *
 * El elemento se queda quieto y lo que avanza es el recorte: una arista
 * inclinada que barre la pantalla de derecha a izquierda, con el pie por
 * delante, de modo que lo último en descubrirse es la esquina superior
 * izquierda. Se controla con la variable `--reveal`, de 0 (nada a la vista) a 1
 * (todo). GSAP la anima como cualquier otra propiedad.
 *
 * La inclinación se va cerrando con el propio avance —de 35 % de desnivel a 0—
 * porque si se mantuviera, al terminar quedaría una esquina sin cubrir.
 *
 * Es distinto de meter el fondo girado: al moverse, la foto se desliza respecto
 * a lo que ya hay en pantalla y se lee como un panel encima. Recortándola, la
 * imagen aparece directamente donde va a quedarse.
 */
export const DIAGONAL_MASK = [
  'polygon(',
  'calc(135% - var(--reveal) * 175%) 0%,',
  '200% 0%,',
  '200% 100%,',
  'calc(100% - var(--reveal) * 140%) 100%',
  ')',
].join(' ')
