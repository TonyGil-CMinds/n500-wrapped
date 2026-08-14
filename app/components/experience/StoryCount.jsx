'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import CountUp from '../ui/CountUp'
import PhysicsPile from '../ui/PhysicsPile'
import SplitWords from '../ui/SplitWords'

/** Tamaños fijos —nada de Math.random— para que la caída sea reproducible. */
const SIZES = [92, 66, 78, 58, 84, 70, 96, 62, 74, 88, 64, 80]
const PILE = SIZES.map((size, i) => ({ src: `/fall-image${i + 1}.png`, size }))

/**
 * Dos momentos encadenados en una sola pantalla, porque la transición entre
 * ellos es continua y con slides separadas el remontaje la cortaría:
 *
 *  1. Las empresas caen y se apilan sobre la mitad de arriba, y debajo corre
 *     el contador hasta 397.
 *  2. La fotografía del bosque sube desde abajo inclinada hacia la izquierda y
 *     tapa el contador —el montón sigue asomando arriba—, un instante después
 *     entra la protagonista, el panel se endereza y aparece el titular.
 */
export default function StoryCount({ slide, sound }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.set('[data-green]', { yPercent: 105, rotation: -6 })
      gsap.set('[data-girl]', { yPercent: 100 })

      if (reduced) {
        gsap.set('[data-green]', { yPercent: 0, rotation: 0 })
        gsap.set('[data-girl]', { yPercent: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // El verde entra cuando el contador ya ha hecho su trabajo.
      tl.to('[data-green]', { yPercent: 0, duration: 1.4 }, 4.2)
        .to('[data-girl]', { yPercent: 0, duration: 1.3 }, 4.75)
        // Ya cubierta la pantalla, el panel se endereza.
        .to('[data-green]', { rotation: 0, duration: 1 }, 5.5)
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

      {/*
        --- Acto 2: el panel verde ---
        Va sobredimensionado (más ancho y más alto que la pantalla) porque
        entra girado: con el tamaño justo, al inclinarse asomarían las esquinas.
      */}
      <div
        data-green
        className="absolute left-[-12%] top-[-8%] z-20 h-[118%] w-[124%] origin-bottom will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/empresa-verde-bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/2"
          style={{
            background: 'linear-gradient(to bottom, rgba(16,21,17,0.7) 0%, transparent 100%)',
          }}
        />
      </div>

      {/*
        La protagonista y las hojas van en su propia capa, a la medida de la
        pantalla. Dentro del panel heredaban su sobredimensión y salía
        ampliada un 24 % y desplazada hacia abajo.
      */}
      <div data-girl className="absolute inset-x-0 bottom-0 z-20 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/empresaverde-girl.png" alt="" aria-hidden className="w-full" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/empresa-verde-asset1.svg"
          alt=""
          aria-hidden
          className="absolute bottom-0 left-[2%] w-[48%] max-w-[240px]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/empresa-verde-asset2.svg"
          alt=""
          aria-hidden
          className="absolute -right-2 bottom-0 w-[24%] max-w-[120px]"
        />
      </div>

      {/* --- Titular, ya sobre la foto --- */}
      <div data-title className="absolute inset-x-0 top-[13vh] z-30 flex flex-col items-center">
        <p className="font-display text-[clamp(1.3rem,6.5vw,2rem)] font-extrabold uppercase tracking-tight text-white">
          <SplitWords text={slide.greenKicker} />
        </p>
        <h2 className="font-display text-[clamp(3rem,17vw,5.6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-lime">
          <SplitWords text={slide.greenHeadline} />
        </h2>
      </div>
    </div>
  )
}
