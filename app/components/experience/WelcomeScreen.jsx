'use client'

import { useEffect, useRef, useState } from 'react'
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
 * su alrededor.
 *
 * Etapas: count → reveal (sale la N, entran líneas y elementos)
 *              → logo (los caracteres dan paso al logotipo) → ready
 */
export default function WelcomeScreen({ onStart, sound, needsGesture }) {
  const [stage, setStage] = useState('count')
  const [leaving, setLeaving] = useState(false)
  const [exit, setExit] = useState(null)
  const logoRef = useRef(null)
  const revealed = stage !== 'count'
  const showLogo = stage === 'logo' || stage === 'ready'

  useEffect(() => {
    if (stage !== 'reveal') return
    // Deja respirar la N antes de relevarla por el logotipo.
    const t = setTimeout(() => setStage('logo'), 900)
    return () => clearTimeout(t)
  }, [stage])

  useEffect(() => {
    if (stage !== 'logo') return
    const t = setTimeout(() => setStage('ready'), 900)
    return () => clearTimeout(t)
  }, [stage])

  function handleCountDone() {
    sound?.reveal()
    setStage('reveal')
  }

  /**
   * Salida: la insignia viaja al centro de la pantalla creciendo y, ya en el
   * centro, se desvanece para dar paso al relato.
   *
   * El desplazamiento se calcula midiendo dónde está la insignia y cuánto le
   * falta hasta el centro del viewport (FLIP): así funciona en cualquier
   * tamaño de pantalla sin posiciones fijas.
   */
  function handleStart() {
    sound?.click()
    const el = logoRef.current
    if (!el) {
      onStart()
      return
    }

    const box = el.getBoundingClientRect()
    const dx = window.innerWidth / 2 - (box.left + box.width / 2)
    const dy = window.innerHeight / 2 - (box.top + box.height / 2)

    setLeaving(true)
    setExit({ transform: `translate(${dx}px, ${dy}px) scale(4.5)`, opacity: 1 })
    // Ya en el centro, desaparece.
    setTimeout(() => {
      setExit({ transform: `translate(${dx}px, ${dy}px) scale(6.5)`, opacity: 0 })
    }, 780)
    setTimeout(onStart, 1250)
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
        <div
          ref={logoRef}
          className={cn(leaving && 'z-50')}
          style={
            exit
              ? {
                  ...exit,
                  transition:
                    'transform 900ms cubic-bezier(0.5,0,0.2,1), opacity 450ms ease-out',
                }
              : undefined
          }
        >
          <LogoMark
            size={64}
            className={cn(!leaving && 'animate-breathe', appear(200).className)}
            style={appear(200).style}
          />
        </div>
      </div>

      <div
        className={cn(
          'relative z-10 flex w-full max-w-2xl flex-col items-center',
          'transition-opacity duration-500',
          leaving && 'opacity-0',
        )}
      >
        <div className="w-full">
          <N500Lockup
            stage={showLogo ? 'logo' : revealed ? 'letter' : 'count'}
            onCountDone={handleCountDone}
            onTick={() => sound?.tick()}
          />
          <span
            className={cn(
              'mt-2 block font-display text-[clamp(2.6rem,15vw,5.2rem)] font-extrabold',
              'leading-[1] tracking-tight text-lime-pale',
              appear(480).className,
            )}
            style={appear(480).style}
          >
            ROOTS
          </span>
        </div>

        <Button
          as="button"
          variant="glass"
          onClick={handleStart}
          onMouseEnter={() => sound?.hover()}
          disabled={stage !== 'ready' || leaving}
          className={cn('mt-10', appear(620).className, stage !== 'ready' && 'cursor-default')}
          style={appear(620).style}
        >
          Empezar ahora
        </Button>

        {needsGesture && stage === 'ready' ? (
          <p className="mt-8 animate-slide-in text-[0.65rem] uppercase tracking-[0.25em] text-white/45">
            Toca para activar el sonido
          </p>
        ) : null}
      </div>

      <div className="relative flex-[1.45]" />

      {/* Plantas asomando por el borde inferior. Entran las últimas, cuando el
          resto de la composición ya está en su sitio. */}
      {revealed ? (
        // Dos capas: la de fuera se lleva las plantas hacia abajo al salir, la
        // de dentro conserva la animación de entrada. Separarlas evita que una
        // animación y una transición peleen por el mismo `transform`.
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-0',
            'transition-transform duration-700',
            '[transition-timing-function:cubic-bezier(0.5,0,0.75,0)]',
            leaving && 'translate-y-full',
          )}
        >
          <div className="animate-rise-up" style={{ animationDelay: '700ms' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/intro-plants.png"
              alt=""
              className="w-full select-none object-cover object-top"
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}
