'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import { useAudioReady } from './useAudioReady'
import { music } from '../lib/audio'

const FADE_MS = 900

/**
 * Música de fondo con crossfade entre pistas.
 *
 * Nada se reproduce hasta que `useAudioReady` confirma que el AudioContext
 * está activo: lanzar play() con el contexto suspendido hace que howler encole
 * la reproducción y la suelte al desbloquear, lo que acababa con las dos
 * canciones sonando a la vez.
 *
 * `needsGesture` sirve para ofrecer el aviso de "toca para activar el sonido".
 */
export function useSoundtrack(enabled = true) {
  const ready = useAudioReady()
  const active = enabled && ready

  const opts = { loop: true, soundEnabled: active, volume: 0 }
  const [playWelcome, { sound: welcomeSound }] = useSound(music.welcome.src, opts)
  const [playStory, { sound: storySound }] = useSound(music.story.src, opts)

  const [current, setCurrent] = useState(null) // 'welcome' | 'story' | null
  const playersRef = useRef({})

  playersRef.current = {
    welcome: { sound: welcomeSound, play: playWelcome, volume: music.welcome.volume },
    story: { sound: storySound, play: playStory, volume: music.story.volume },
  }

  useEffect(() => {
    const players = playersRef.current

    // Silenciar tiene que apagar lo que ya suena. Antes esto salía antes de
    // tiempo cuando `active` era falso, así que el botón encendía el sonido
    // pero no lo apagaba.
    if (!active) {
      for (const { sound } of Object.values(players)) {
        if (!sound?.playing()) continue
        sound.fade(sound.volume(), 0, FADE_MS)
        setTimeout(() => {
          if (sound.volume() === 0) sound.stop()
        }, FADE_MS + 60)
      }
      return
    }

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
  }, [current, active, welcomeSound, storySound])

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
