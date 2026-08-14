'use client'

import { useEffect, useState } from 'react'
import AudioIcon from '../ui/AudioIcon'
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
export default function ExperienceRoot({
  userName,
  companyName,
  initialPhase = 'welcome',
  initialSlide = 0,
}) {
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
        <WelcomeScreen
          sound={sound}
          needsGesture={needsGesture && soundOn}
          onStart={() => setPhase('story')}
        />
      ) : null}

      {phase === 'story' ? (
        <StoryPlayer
          companyName={companyName}
          userName={userName}
          initialSlide={initialSlide}
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
          // Al silenciar aún suena, así que el clic da acuse; al reactivar el
          // hook todavía está deshabilitado y no sonaría de todos modos.
          if (soundOn) sound.click()
          setSoundOn((on) => !on)
        }}
        aria-pressed={soundOn}
        className={cn(
          'fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full',
          'border border-white/15 bg-white/[0.04] backdrop-blur-sm transition-colors',
          'hover:border-white/40',
          needsGesture && soundOn && 'animate-breathe border-lime/60',
        )}
        title={soundOn ? 'Silenciar' : 'Activar sonido'}
      >
        {/* Las ondas sólo se animan cuando algo está sonando de verdad */}
        <AudioIcon active={soundOn && !needsGesture} size={17} />
        <span className="sr-only">{soundOn ? 'Silenciar' : 'Activar sonido'}</span>
      </button>

      {/* En la bienvenida el aviso va bajo el botón (lo pinta WelcomeScreen);
          abajo del todo chocaría con las plantas. */}
      {needsGesture && soundOn && phase !== 'welcome' ? (
        <p className="pointer-events-none fixed inset-x-0 bottom-6 z-50 text-center text-[0.65rem] uppercase tracking-[0.25em] text-white/45">
          Toca para activar el sonido
        </p>
      ) : null}
    </main>
  )
}
