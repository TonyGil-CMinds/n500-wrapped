/**
 * Manifiesto de audio. Todo vive en `public/audio/`, así que las rutas son
 * URLs servidas estáticamente desde la raíz del sitio.
 */

/** Música de fondo. Cada fase de la experiencia usa una. */
export const music = {
  /** Bucle de la pantalla de bienvenida, antes de empezar. */
  welcome: {
    id: 'glorious-imperfection',
    title: 'Glorious Imperfection',
    src: '/audio/glorious-imperfection.wav',
    loop: true,
    volume: 0.45,
  },
  /** Suena durante el relato, desde que el usuario pulsa "Empezar". */
  story: {
    id: 'the-start-of-a-startup',
    title: 'The Start of a Startup',
    src: '/audio/the-start-of-a-startup.wav',
    loop: true,
    volume: 0.4,
  },
}

/**
 * Efectos de interfaz, sintetizados como WAV cortos.
 * Se regeneran con el script de `scripts/` si hace falta afinarlos.
 */
export const sfx = {
  click: { src: '/audio/ui/click.wav', volume: 0.18 },
  hover: { src: '/audio/ui/hover.wav', volume: 0.25 },
  whoosh: { src: '/audio/ui/whoosh.wav', volume: 0.35 },
  tick: { src: '/audio/ui/tick.wav', volume: 0.3 },
  reveal: { src: '/audio/ui/reveal.wav', volume: 0.5 },
  card: { src: '/audio/ui/card.wav', volume: 0.22 },
}

/** Lista plana, útil para precargar o para la página de demo. */
export const allTracks = [music.welcome, music.story]
