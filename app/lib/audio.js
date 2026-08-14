/**
 * Manifiesto de audio. Todo vive en `public/audio/`, así que las rutas son
 * URLs servidas estáticamente desde la raíz del sitio.
 */

/**
 * Música de fondo. Cada fase de la experiencia usa una.
 *
 * Van en AAC con MP3 de reserva, y no en WAV: los originales pesaban 10 y
 * 12 MB, que en una conexión móvil tardan una eternidad en estar listos para
 * sonar. Comprimidos bajan a menos de 1 MB cada uno. howler recorre la lista
 * y se queda con el primer formato que el navegador admita.
 */
export const music = {
  /** Bucle de la pantalla de bienvenida, antes de empezar. */
  welcome: {
    id: 'glorious-imperfection',
    title: 'Glorious Imperfection',
    src: ['/audio/glorious-imperfection.m4a', '/audio/glorious-imperfection.mp3'],
    loop: true,
    volume: 0.45,
  },
  /** Suena durante el relato, desde que el usuario pulsa "Empezar". */
  story: {
    id: 'the-start-of-a-startup',
    title: 'The Start of a Startup',
    src: ['/audio/the-start-of-a-startup.m4a', '/audio/the-start-of-a-startup.mp3'],
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
