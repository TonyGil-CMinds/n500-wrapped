'use client'

import { useCallback } from 'react'
import useSound from 'use-sound'
import { useAudioReady } from './useAudioReady'
import { sfx } from '../lib/audio'

/**
 * Efectos de interfaz sobre use-sound (howler).
 *
 * Se mantienen deshabilitados hasta que el AudioContext esté activo. Con
 * `soundEnabled: false`, use-sound ni siquiera llama a play(), así que los
 * efectos disparados antes del primer gesto (los ticks del odómetro, por
 * ejemplo) se descartan en vez de encolarse y sonar todos de golpe después.
 */
export function useUiSound(enabled = true) {
  const ready = useAudioReady()
  const opts = { soundEnabled: enabled && ready, interrupt: true }

  // El clic lleva cola de reverberación: si se interrumpiera, dos pulsaciones
  // seguidas cortarían la cola de golpe. Dejándolas solaparse suena como en el
  // espacio real, donde el segundo golpe no calla el eco del primero.
  const [playClick] = useSound(sfx.click.src, {
    ...opts,
    interrupt: false,
    volume: sfx.click.volume,
  })
  const [playHover] = useSound(sfx.hover.src, { ...opts, volume: sfx.hover.volume })
  const [playWhoosh] = useSound(sfx.whoosh.src, { ...opts, volume: sfx.whoosh.volume })
  const [playTick] = useSound(sfx.tick.src, { ...opts, volume: sfx.tick.volume })
  const [playReveal] = useSound(sfx.reveal.src, { ...opts, volume: sfx.reveal.volume })
  const [playCard] = useSound(sfx.card.src, { ...opts, volume: sfx.card.volume })

  return {
    click: useCallback(() => playClick(), [playClick]),
    hover: useCallback(() => playHover(), [playHover]),
    whoosh: useCallback(() => playWhoosh(), [playWhoosh]),
    tick: useCallback(() => playTick(), [playTick]),
    reveal: useCallback(() => playReveal(), [playReveal]),
    card: useCallback(() => playCard(), [playCard]),
  }
}
