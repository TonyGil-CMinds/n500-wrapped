'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import AvatarChip from '../ui/AvatarChip'
import SplitWords from '../ui/SplitWords'

/**
 * Primera slide del relato: titular en dos partes, bloques de color y el
 * retrato subiendo desde abajo.
 *
 * Toda la coreografía va con GSAP en una sola línea de tiempo, porque los
 * tramos se solapan (el retrato empieza antes de que acaben los bloques) y eso
 * con `animation-delay` de CSS obliga a cuadrar retardos a mano.
 */
export default function StoryHero({ slide, userName }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set('[data-word], [data-block], [data-portrait], [data-chip]', {
          clearProps: 'all',
          opacity: 1,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('[data-chip]', { y: 14, opacity: 0, duration: 0.5 })
        // Palabras: suben desde debajo de su máscara, una tras otra.
        .from(
          '[data-word]',
          { yPercent: 115, opacity: 0, duration: 0.65, stagger: 0.08 },
          '-=0.2',
        )
        // Bloques: entran girados y se enderezan.
        .from(
          '[data-block]',
          {
            scale: 0.45,
            rotation: (i) => (i === 0 ? -55 : 48),
            xPercent: (i) => (i === 0 ? -35 : 35),
            yPercent: 30,
            opacity: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: 'back.out(1.5)',
          },
          '-=0.35',
        )
        // Retrato: sube describiendo una curva. La curva sale de animar a la
        // vez desplazamiento vertical, lateral y giro con la misma easing: el
        // centro del retrato no recorre una recta sino un arco.
        .from(
          '[data-portrait]',
          {
            yPercent: 70,
            xPercent: -7,
            rotation: -5,
            scale: 0.93,
            opacity: 0,
            duration: 1.25,
            ease: 'expo.out',
          },
          '-=0.7',
        )

      // Deriva continua de los bloques, encadenada AL FINAL de la entrada.
      // Lanzarla suelta la haría arrancar en el instante 0 y pelearse con el
      // `.from` por las mismas propiedades.
      tl.to(
        '[data-block]',
        {
          y: '+=10',
          rotation: '+=6',
          duration: 4.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.6,
        },
        '>',
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    // Cubre el área de la slide en vez de dejarse centrar por ella: así el
    // borde inferior es un punto de anclaje fiable para el retrato. Con
    // `h-full` el porcentaje no resolvía contra el contenedor flex.
    <div ref={root} className="absolute inset-0 flex flex-col items-center">
      <AvatarChip name={userName} data-chip className="mt-4" />

      <p className="mt-9 text-xs uppercase tracking-[0.3em] text-white/85">
        <SplitWords text={slide.kicker} />
      </p>

      <h2 className="mt-3 font-display text-[clamp(2.6rem,15vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-white">
        <SplitWords text={slide.headline} wordClassName="text-lime-pale" />
      </h2>

      {/*
        Retrato y bloques anclados al borde inferior de la pantalla. El PNG
        está recortado a la altura del pecho, así que el corte tiene que caer
        fuera de cuadro: por eso el bloque baja más allá del área de la slide.
      */}
      {/* `-mx-6` compensa el padding lateral de la slide para que el retrato
          pueda ocupar todo el ancho de la pantalla. */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-16 -mx-6 flex justify-center">
        <div className="relative flex w-full justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-block
            src="/block-green.svg"
            alt=""
            aria-hidden
            className="absolute bottom-[22%] left-[-4%] w-[34%] max-w-[150px] -rotate-45"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-block
            src="/block-blue.svg"
            alt=""
            aria-hidden
            className="absolute bottom-[10%] right-[-6%] w-[38%] max-w-[165px] rotate-45"
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-portrait
            src="/1-guy.png"
            alt=""
            aria-hidden
            className="relative w-[88%] max-w-[360px] select-none"
          />
        </div>
      </div>
    </div>
  )
}
