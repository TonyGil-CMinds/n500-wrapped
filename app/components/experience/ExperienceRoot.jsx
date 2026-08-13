'use client'

import { useEffect, useState } from 'react'
import BadgeScreen from './BadgeScreen'
import StoryPlayer from './StoryPlayer'
import WelcomeScreen from './WelcomeScreen'
import { useSoundtrack } from '../../hooks/useSoundtrack'
import { useUiSound } from '../../hooks/useUiSound'
import { cn } from '../../lib/cn'

/**
 * Máquina de estados de la experiencia: bienvenida → relato → medalla.
 * También es la dueña del audio, para que la música sobreviva a los cambios
 * de pantalla y pueda hacer crossfade entre pistas.
 */
export default function ExperienceRoot({ userName, companyName, initialPhase = 'welcome' }) {
  const [phase, setPhase] = useState(initialPhase)
  const [soundOn, setSoundOn] = useState(true)

  const sound = useUiSound(soundOn)
  const { playTrack, needsGesture } = useSoundtrack(soundOn)

  useEffect(() => {
    playTrack(phase === 'welcome' ? 'welcome' : 'story')
  }, [phase, playTrack])

  return (
    <main className="relative">
      {phase === 'welcome' ? (
        <WelcomeScreen userName={userName} sound={sound} onStart={() => setPhase('story')} />
      ) : null}

      {phase === 'story' ? (
        <StoryPlayer
          companyName={companyName}
          sound={sound}
          onFinish={() => setPhase('badge')}
        />
      ) : null}

      {phase === 'badge' ? (
        <BadgeScreen
          companyName={companyName}
          sound={sound}
          onRestart={() => setPhase('welcome')}
        />
      ) : null}

      {/* Control de sonido, siempre accesible */}
      <button
        type="button"
        onClick={() => {
          if (!soundOn) sound.click()
          setSoundOn((on) => !on)
        }}
        aria-pressed={soundOn}
        className={cn(
          'fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full',
          'border border-white/15 bg-black/40 text-sm backdrop-blur-sm transition-colors',
          'hover:border-white/40',
          needsGesture && soundOn && 'animate-breathe border-lime/60',
        )}
        title={soundOn ? 'Silenciar' : 'Activar sonido'}
      >
        <span aria-hidden>{soundOn ? '🔊' : '🔇'}</span>
        <span className="sr-only">{soundOn ? 'Silenciar' : 'Activar sonido'}</span>
      </button>

      {needsGesture && soundOn ? (
        <p className="pointer-events-none fixed inset-x-0 bottom-6 z-50 text-center text-xs text-white/50">
          Toca para activar el sonido
        </p>
      ) : null}
    </main>
  )
}
