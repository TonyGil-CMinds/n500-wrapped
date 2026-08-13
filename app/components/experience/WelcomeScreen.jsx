'use client'

import { useEffect, useState } from 'react'
import AvatarChip from '../ui/AvatarChip'
import Button from '../ui/Button'
import GuideLines from '../ui/GuideLines'
import LogoMark from '../ui/LogoMark'
import N500Lockup from '../ui/N500Lockup'
import Particles from '../ui/Particles'
import { cn } from '../../lib/cn'

/**
 * Carga + bienvenida en una sola escena.
 *
 * El odómetro ocupa desde el principio el sitio final del titular, así que
 * cuando termina de contar no se mueve: el resto de la composición aparece a
 * su alrededor. Etapas: count → reveal (N + líneas + elementos) → ready.
 */
export default function WelcomeScreen({ userName, onStart, sound }) {
  const [stage, setStage] = useState('count')
  const revealed = stage !== 'count'

  useEffect(() => {
    if (stage !== 'reveal') return
    const t = setTimeout(() => setStage('ready'), 1400)
    return () => clearTimeout(t)
  }, [stage])

  function handleCountDone() {
    sound?.reveal()
    setStage('reveal')
  }

  /**
   * Entrada escalonada. El retardo va por `style` y no por una clase
   * interpolada: Tailwind sólo genera las clases que encuentra literalmente
   * en el código, así que `[animation-delay:${x}]` nunca existiría.
   */
  const appear = (delayMs) => ({
    className: cn(revealed ? 'animate-slide-in' : 'invisible opacity-0'),
    style: revealed ? { animationDelay: `${delayMs}ms` } : undefined,
  })

  return (
    <section className="wrapped-slide justify-between py-16">
      <div
        aria-hidden
        className={cn(
          'glow-floor pointer-events-none absolute inset-0 transition-opacity duration-[1600ms]',
          revealed ? 'opacity-100' : 'opacity-0',
        )}
      />
      {/* Se montan al revelar: animate-slice arranca en scaleY(0), así que
          montarlas aquí es lo que produce el corte desde abajo y desde arriba. */}
      {revealed ? <GuideLines animate /> : null}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-[2000ms]',
          revealed ? 'opacity-100' : 'opacity-0',
        )}
      >
        <Particles />
      </div>

      <div className="relative flex flex-1 items-center">
        <LogoMark
          size={64}
          className={cn('animate-breathe', appear(200).className)}
          style={appear(200).style}
        />
      </div>

      <div className="relative flex w-full max-w-2xl flex-col items-center">
        <AvatarChip name={userName} {...appear(340)} />

        <div className="mt-6 w-full">
          <N500Lockup
            revealN={revealed}
            onCountDone={handleCountDone}
            onTick={() => sound?.tick()}
          />
          <span
            className={cn(
              'mt-1 block font-serif text-[clamp(2.5rem,14.5vw,5rem)] italic',
              'leading-[1.08] text-lime-pale',
              appear(480).className,
            )}
            style={appear(480).style}
          >
            nos conecta
          </span>
        </div>

        <Button
          as="button"
          variant="glass"
          onClick={() => {
            sound?.click()
            onStart()
          }}
          onMouseEnter={() => sound?.hover()}
          disabled={stage !== 'ready'}
          className={cn('mt-10', appear(620).className, stage !== 'ready' && 'cursor-default')}
          style={appear(620).style}
        >
          Empezar ahora
        </Button>
      </div>

      <div className="relative flex-[1.45]" />
    </section>
  )
}
