'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CountUp from '../ui/CountUp'
import PhysicsPile from '../ui/PhysicsPile'
import GreenScene from './GreenScene'

/** Tamaños fijos —nada de Math.random— para que la caída sea reproducible. */
const SIZES = [92, 66, 78, 58, 84, 70, 96, 62, 74, 88, 64, 80]
const PILE = SIZES.map((size, i) => ({ src: `/fall-image${i + 1}.png`, size }))

/**
 * Dos momentos encadenados en una sola pantalla, porque la transición entre
 * ellos es continua y con slides separadas el remontaje la cortaría:
 *
 *  1. Las empresas caen y se apilan sobre la mitad de arriba, y debajo corre
 *     el contador hasta 397.
 *  2. Una máscara diagonal descubre la fotografía del bosque sobre el contador,
 *     un instante después entra la protagonista y aparece el titular.
 */
export default function StoryCount({ slide, sound }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set('[data-girl]', { yPercent: 100 })

      if (reduced) {
        gsap.set('[data-green]', { '--reveal': 1 })
        gsap.set('[data-girl]', { yPercent: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // El verde entra cuando el contador ya ha hecho su trabajo.
      tl.to('[data-green]', { '--reveal': 1, duration: 1.9, ease: 'power2.inOut' }, 4.2)
        .to('[data-girl]', { yPercent: 0, duration: 1.3 }, 4.9)
        .from(
          '[data-title] [data-word]',
          { yPercent: 115, opacity: 0, duration: 0.6, stagger: 0.07 },
          6.2,
        )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden">
      {/* --- Acto 1: el montón y el contador --- */}
      <div className="absolute inset-x-0 top-0 h-1/2">
        <PhysicsPile items={PILE} className="h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              'linear-gradient(to top, #101511 12%, rgba(16,21,17,0.55) 55%, transparent)',
          }}
        />
      </div>

      <div className="absolute inset-x-0 top-[62%] flex flex-col items-center">
        <p className="animate-slide-in text-[0.68rem] uppercase tracking-[0.28em] text-white/85">
          {slide.kicker}
        </p>

        <div className="relative mt-4 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/asset-cookievblue.svg"
            alt=""
            aria-hidden
            className="absolute -left-4 -top-2 w-16 animate-slide-in"
            style={{ animationDelay: '260ms' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/asset-greenstart.svg"
            alt=""
            aria-hidden
            className="absolute -right-6 bottom-0 w-16 animate-slide-in"
            style={{ animationDelay: '380ms' }}
          />
          <span className="relative font-display text-[clamp(4.5rem,26vw,9rem)] font-extrabold leading-none tracking-tight text-lime">
            <CountUp to={slide.value} durationMs={2200} onTick={() => sound?.tick()} />
          </span>
        </div>

        <p
          className="mt-6 inline-flex animate-slide-in items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-lime"
          style={{ animationDelay: '520ms' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-verified.svg" alt="" aria-hidden className="h-5 w-5" />
          {slide.label}
        </p>
      </div>

      {/* --- Acto 2: la escena verde, que la slide siguiente hereda tal cual --- */}
      <GreenScene kicker={slide.greenKicker} headline={slide.greenHeadline} revealed={0} />
    </div>
  )
}
