'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import { useAudioReady } from './useAudioReady'
import { music } from '../lib/audio'

const FADE_MS = 900

/**
 * Música de fondo con crossfade entre pistas.
 *
 * Sobre el desbloqueo en móvil, que es lo delicado:
 *
 *  - En iOS (y en Android con ahorro de datos) el navegador sólo deja arrancar
 *    audio DENTRO del gesto del usuario. No basta con reanudar el AudioContext
 *    en el gesto y reproducir después: para cuando el estado de React ha dado
 *    la vuelta, el gesto ya terminó y la reproducción se bloquea en silencio.
 *    Por eso el primer `play()` se lanza de forma síncrona en el propio
 *    manejador del evento, sin pasar por el estado.
 *
 *  - Aun así, el efecto que cambia de pista sigue esperando a `ready`. Llamar
 *    a play() con el contexto suspendido hace que howler encole la
 *    reproducción y la suelte toda junta al desbloquear.
 *
 * `needsGesture` sirve para ofrecer el aviso de "toca para activar el sonido".
 */
export function useSoundtrack(enabled = true) {
  const ready = useAudioReady()

  // `soundEnabled` NO depende de `ready`: si lo hiciera, use-sound descartaría
  // el play() que lanzamos dentro del gesto, que es justo el que funciona.
  const opts = { loop: true, soundEnabled: enabled, volume: 0 }
  const [playWelcome, { sound: welcomeSound }] = useSound(music.welcome.src, opts)
  const [playStory, { sound: storySound }] = useSound(music.story.src, opts)

  const [current, setCurrent] = useState(null) // 'welcome' | 'story' | null
  const playersRef = useRef({})
  const currentRef = useRef(null)

  currentRef.current = current
  playersRef.current = {
    welcome: { sound: welcomeSound, play: playWelcome, volume: music.welcome.volume },
    story: { sound: storySound, play: playStory, volume: music.story.volume },
  }

  // Arranque dentro del gesto. Se mantiene escuchando mientras no haya sonado
  // nada: en una conexión lenta howler puede tardar en cargar y perderse los
  // primeros toques, así que cada toque vuelve a intentarlo.
  useEffect(() => {
    if (!enabled) return

    const start = () => {
      const player = playersRef.current[currentRef.current]
      if (!player?.sound || player.sound.playing()) return

      player.sound.volume(0)
      player.play() // síncrono: seguimos dentro del gesto
      player.sound.fade(0, player.volume, FADE_MS)
    }

    const events = ['pointerdown', 'touchend', 'keydown']
    events.forEach((e) => window.addEventListener(e, start, { capture: true }))
    return () => events.forEach((e) => window.removeEventListener(e, start, { capture: true }))
  }, [enabled])

  // Cambio de pista y silenciado.
  useEffect(() => {
    const players = playersRef.current

    // Silenciar tiene que apagar lo que ya suena.
    if (!enabled) {
      for (const { sound } of Object.values(players)) {
        if (!sound?.playing()) continue
        sound.fade(sound.volume(), 0, FADE_MS)
        setTimeout(() => {
          if (sound.volume() === 0) sound.stop()
        }, FADE_MS + 60)
      }
      return
    }

    // Sin gesto todavía: no tocamos nada, que howler encolaría.
    if (!ready) return

    for (const [key, player] of Object.entries(players)) {
      const { sound, volume } = player
      if (!sound) continue

      if (key === current) {
        if (!sound.playing()) {
          sound.volume(0)
          player.play()
        }
        sound.fade(sound.volume(), volume, FADE_MS)
        continue
      }

      // Apagamos por intención, no por estado: una pista puede haber quedado
      // pendiente de arrancar y no aparecer todavía como `playing()`.
      if (sound.playing()) {
        sound.fade(sound.volume(), 0, FADE_MS)
        setTimeout(() => {
          const other = playersRef.current[key]?.sound
          if (other && other.volume() === 0) other.stop()
        }, FADE_MS + 60)
      } else {
        sound.stop()
        sound.volume(0)
      }
    }
  }, [current, enabled, ready, welcomeSound, storySound])

  // Al desmontar, corta cualquier pista viva.
  useEffect(() => {
    const players = playersRef.current
    return () => {
      for (const player of Object.values(players)) player.sound?.stop()
    }
  }, [])

  return {
    playTrack: useCallback((key) => setCurrent(key), []),
    current,
    needsGesture: enabled && !ready,
  }
}
