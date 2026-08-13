'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

/**
 * Reproductor mínimo sobre <audio> nativo.
 * Sirve de comprobación de que los archivos de `public/audio/` se sirven bien:
 * si la ruta falla, el estado pasa a "error" en lugar de quedarse en silencio.
 */
export default function AudioPlayer({ track }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [status, setStatus] = useState('idle') // idle | ready | error
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onReady = () => setStatus('ready')
    const onError = () => {
      setStatus('error')
      setIsPlaying(false)
    }
    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    // Con preload="metadata" puede que `canplay` no llegue hasta pulsar play,
    // así que `loadedmetadata` es la señal fiable de que la ruta resolvió.
    audio.addEventListener('loadedmetadata', onReady)
    audio.addEventListener('canplay', onReady)
    audio.addEventListener('error', onError)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onReady)
      audio.removeEventListener('canplay', onReady)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }
    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      // El navegador puede bloquear la reproducción automática.
      setStatus('error')
    }
  }

  return (
    <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-surface/80 p-4">
      <audio ref={audioRef} src={track.src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
        className={cn(
          'relative grid h-12 w-12 shrink-0 place-items-center rounded-full text-ink transition-colors',
          status === 'error' ? 'bg-red-400' : 'bg-accent hover:bg-accent-soft',
        )}
      >
        {isPlaying ? (
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-accent-soft" />
        ) : null}
        <span className="text-lg leading-none">{isPlaying ? '❚❚' : '▶'}</span>
      </button>

      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold">{track.title}</p>
        <p className="text-xs text-white/50">
          {status === 'error'
            ? 'No se pudo cargar el audio'
            : status === 'ready'
              ? 'Listo desde /public/audio'
              : 'Cargando…'}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-accent transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
