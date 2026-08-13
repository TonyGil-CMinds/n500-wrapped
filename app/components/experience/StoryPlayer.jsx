'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import GuideLines from '../ui/GuideLines'
import LogoMark from '../ui/LogoMark'
import Particles from '../ui/Particles'
import StoryProgress from '../ui/StoryProgress'
import StorySlide from './StorySlide'
import { slides } from '../../lib/story'
import { cn } from '../../lib/cn'

const HOLD_MS = 260
/** Lo que tarda la slide saliente en desvanecerse antes de montar la siguiente. */
const EXIT_MS = 340

/**
 * Reproductor del relato, con la mecánica de unas "stories": auto-avance,
 * barra por slide, toque a izquierda/derecha para navegar y mantener pulsado
 * para pausar.
 */
export default function StoryPlayer({ companyName, userName, onFinish, sound }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [exiting, setExiting] = useState(false)
  const barsRef = useRef([])
  const pressedAt = useRef(0)
  const leaving = useRef(false)

  const slide = slides[index]

  /**
   * El cambio de slide no es instantáneo: la saliente se desvanece durante
   * EXIT_MS y sólo entonces se monta la siguiente. Sin esa pausa el corte es
   * seco, porque el `key` del contenedor desmonta el contenido de golpe.
   */
  const goTo = useCallback(
    (next) => {
      if (next < 0 || leaving.current) return

      leaving.current = true
      setExiting(true)
      sound?.whoosh()

      setTimeout(() => {
        leaving.current = false
        setExiting(false)
        if (next >= slides.length) onFinish()
        else setIndex(next)
      }, EXIT_MS)
    },
    [onFinish, sound],
  )

  // Avance automático. El progreso se escribe por ref: un setState por frame
  // volvería a montar la slide entera 60 veces por segundo.
  useEffect(() => {
    let raf
    let elapsed = 0
    let last = null

    // Las barras anteriores quedan llenas, las siguientes vacías.
    barsRef.current.forEach((bar, i) => {
      if (bar) bar.style.width = i < index ? '100%' : '0%'
    })

    const frame = (now) => {
      if (last === null) last = now
      if (!paused) elapsed += now - last
      last = now

      const pct = Math.min((elapsed / slide.ms) * 100, 100)
      const bar = barsRef.current[index]
      if (bar) bar.style.width = `${pct}%`

      if (pct >= 100) {
        goTo(index + 1)
        return
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [index, paused, slide.ms, goTo])

  // Navegación por teclado, además de los toques.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goTo])

  function handlePointerDown() {
    pressedAt.current = performance.now()
    setPaused(true)
  }

  function handlePointerUp(e) {
    const held = performance.now() - pressedAt.current
    setPaused(false)
    if (held >= HOLD_MS) return // era una pausa, no un toque

    const rect = e.currentTarget.getBoundingClientRect()
    const isLeft = e.clientX - rect.left < rect.width * 0.32
    goTo(isLeft ? index - 1 : index + 1)
  }

  return (
    <section
      className="wrapped-slide select-none justify-between py-8"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setPaused(false)}
    >
      <div aria-hidden className="glow-floor pointer-events-none absolute inset-0" />
      <GuideLines />
      <Particles />

      <header className="relative z-20 flex w-full max-w-2xl flex-col gap-4">
        <StoryProgress count={slides.length} index={index} barsRef={barsRef} />
        {/* pr-12 deja hueco al control de sonido, que va fijo arriba a la derecha */}
        <div className="flex items-center justify-between pr-12">
          <LogoMark size={34} />
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => {
              sound?.click()
              onFinish()
            }}
            className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
          >
            Saltar
          </button>
        </div>
      </header>

      {/* `key` fuerza el remontaje para que las animaciones de entrada
          vuelvan a dispararse en cada slide. */}
      {/* `w-full` es necesario: en un flex en columna con `items-center` el
          hijo se encoge a su contenido, y las slides que se posicionan en
          absoluto no dejan contenido en flujo con el que medir. */}
      <div
        key={slide.id}
        className={cn(
          'relative z-10 flex w-full flex-1 items-center justify-center',
          'transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,1,1)]',
          exiting ? 'translate-y-[-14px] scale-[0.97] opacity-0 blur-[2px]' : 'opacity-100',
        )}
      >
        <StorySlide slide={slide} companyName={companyName} userName={userName} />
      </div>

      <footer className="relative z-10 h-6 text-xs uppercase tracking-[0.25em] text-white/30">
        {paused ? 'En pausa' : ''}
      </footer>
    </section>
  )
}
