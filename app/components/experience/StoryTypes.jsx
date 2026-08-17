'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import BlueScene from './BlueScene'

/**
 * Los tipos de empresa, encadenados con el final de "Empresas Azules".
 *
 * Arranca en su último fotograma y de inmediato el círculo azul —que allí era
 * una de las manchas del pie— crece hasta tragarse la pantalla entera. Con todo
 * cubierto, la escena anterior se retira por detrás; el círculo encoge hasta su
 * sitio y desde ahí van brotando las piezas de la composición, una a una,
 * mientras el rótulo va pasando los cuatro tipos como un odómetro.
 *
 * El recorrido del círculo se calcula en píxeles a partir de su propia caja: es
 * la única forma de que "tapar la pantalla" y "colocarse ahí" signifiquen lo
 * mismo en un móvil estrecho que en una pantalla ancha.
 */

/** Orden de aparición; el z lo decide el marcado, no esto. */
const PIECES = [
  { key: 'mask1', at: 2.1 },
  { key: 'cookie', at: 2.6 },
  { key: 'green', at: 3.1 },
  { key: 'mask2', at: 3.6 },
  { key: 'orange', at: 4.1 },
]

const FIRST_WORD_AT = 2.1
const WORD_EVERY = 1.7

export default function StoryTypes({ slide, sound }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const words = slide.items

      gsap.set('[data-piece]', { scale: 0, opacity: 0 })
      gsap.set('[data-odometer]', { opacity: 0 })
      gsap.set('[data-word]', { yPercent: 110 })

      if (reduced) {
        gsap.set('[data-scene]', { opacity: 0 })
        gsap.set('[data-piece]', { scale: 1, opacity: 1 })
        gsap.set('[data-odometer]', { opacity: 1 })
        gsap.set(`[data-word="${words.length - 1}"]`, { yPercent: 0 })
        gsap.set('[data-circle]', { opacity: 0 })
        return
      }

      // Dónde está el círculo ahora y dónde tiene que ir.
      const stage = root.current.getBoundingClientRect()
      const circle = root.current.querySelector('[data-circle]')
      const box = circle.getBoundingClientRect()
      const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
      const move = (px, py) => ({
        x: stage.x + stage.width * px - from.x,
        y: stage.y + stage.height * py - from.y,
      })
      // Radio necesario para que, centrado, no quede ni una esquina fuera.
      const cover = (Math.hypot(stage.width, stage.height) / box.width) * 1.05

      const centre = move(0.5, 0.5)
      const rest = move(0.62, 0.7)

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.to(
        '[data-circle]',
        { ...centre, scale: cover, duration: 0.85, ease: 'power2.in' },
        0.25,
      )
        // Ya no se ve nada de la pantalla anterior: se retira sin más.
        .set('[data-scene]', { opacity: 0 }, 1.08)
        .to(
          '[data-circle]',
          { ...rest, scale: 1.15, duration: 0.9, ease: 'power3.out' },
          1.15,
        )
        .to('[data-odometer]', { opacity: 1, duration: 0.4 }, 1.9)

      for (const { key, at } of PIECES) {
        tl.to(
          `[data-piece="${key}"]`,
          { scale: 1, opacity: 1, duration: 0.75, ease: 'back.out(1.7)' },
          at,
        )
      }

      // La galleta ocupa el sitio del círculo, así que éste se apaga al llegar.
      tl.to('[data-circle]', { opacity: 0, duration: 0.5 }, 2.7)

      // El rótulo: la palabra que entra empuja hacia arriba a la que había.
      words.forEach((_, i) => {
        const at = FIRST_WORD_AT + i * WORD_EVERY
        tl.to(`[data-word="${i}"]`, { yPercent: 0, duration: 0.55, ease: 'power3.out' }, at)
        if (i > 0) {
          tl.to(
            `[data-word="${i - 1}"]`,
            { yPercent: -110, duration: 0.55, ease: 'power3.in' },
            at,
          )
        }
      })

      const calls = [
        gsap.delayedCall(0.25, () => sound?.whoosh()),
        ...PIECES.map(({ at }) => gsap.delayedCall(at, () => sound?.card())),
      ]
      return () => calls.forEach((c) => c.kill())
    }, root)

    return () => ctx.revert()
  }, [slide, sound])

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden">
      {/* Fotograma heredado de la pantalla anterior. */}
      <div data-scene className="absolute inset-0">
        <BlueScene kicker={slide.fromKicker} headline={slide.fromHeadline} />
      </div>

      {/*
        El círculo arranca justo donde lo dejó la mancha del pie de la escena
        azul: mismas medidas y misma posición, o el salto se vería.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-circle
        src="/asset-bluecircle.svg"
        alt=""
        aria-hidden
        className="absolute -bottom-[5%] -left-[9%] z-[70] w-[42%] will-change-transform"
      />

      {/* --- La composición. El orden aquí es el de apilado. --- */}
      <div aria-hidden className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-piece="orange"
          src="/asset-orangesemicircles.svg"
          alt=""
          className="absolute left-[9%] top-[6%] w-[52%]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-piece="mask2"
          src="/asset-mask2.png"
          alt=""
          className="absolute left-[29%] top-[17%] w-[61%]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-piece="green"
          src="/asset-greenstar.svg"
          alt=""
          className="absolute left-[11%] top-[37%] w-[64%]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-piece="mask1"
          src="/asset-mask1.png"
          alt=""
          className="absolute left-[11%] top-[41%] w-[58%]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-piece="cookie"
          src="/asset-bluecookie.svg"
          alt=""
          className="absolute left-[44%] top-[60%] z-[75] w-[41%]"
        />
      </div>

      {/*
        El rótulo. Las palabras se apilan en la misma caja y sólo una está a la
        vista; el ancho lo fija un duplicado invisible de la más larga, para que
        la píldora no dé un salto cada vez que cambia el texto.
      */}
      <div
        data-odometer
        className="absolute inset-x-0 bottom-[9%] z-[90] flex justify-center"
      >
        <div className="relative overflow-hidden rounded-xl bg-white/[0.06] px-6 py-3">
          <span
            aria-hidden
            className="invisible block whitespace-nowrap font-display text-sm font-bold text-lime"
          >
            {slide.items.reduce((a, b) => (b.length > a.length ? b : a))}
          </span>
          {slide.items.map((item, i) => (
            <span
              key={item}
              data-word={i}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-display text-sm font-bold text-lime"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
