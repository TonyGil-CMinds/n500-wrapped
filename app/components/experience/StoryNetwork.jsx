'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import NetworkCard from '../ui/NetworkCard'
import OrbitSystem from '../ui/OrbitSystem'
import SplitWords from '../ui/SplitWords'
import { cards } from '../../lib/cards'

/** Vueltas que da la rueda antes de dejar arriba la tarjeta destacada. */
const TURNS = 1.75
const RADIUS = 300

/**
 * Posición de una tarjeta en la rueda para un ángulo dado. La circunferencia
 * se aplasta para que en un móvil las vecinas asomen por los lados en vez de
 * salirse por abajo. `theta = 0` es el puesto destacado.
 */
function seatAt(theta) {
  const front = (1 + Math.cos(theta)) / 2
  return {
    x: Math.sin(theta) * RADIUS * 0.9,
    y: (1 - Math.cos(theta)) * RADIUS * 0.5,
    rotation: Math.sin(theta) * 12,
    scale: 0.75 + 0.25 * front,
    opacity: 0.3 + 0.7 * front,
    blur: (1 - front) * 5,
    zIndex: Math.round(100 + Math.cos(theta) * 50),
  }
}

/** Cómo queda cada tarjeta del fondo una vez apiladas. */
const STACK = [
  { rotation: -9, x: -18, y: 12, scale: 0.95, blur: 3 },
  { rotation: 8, x: 20, y: 22, scale: 0.9, blur: 6 },
  { rotation: -5, x: -8, y: 32, scale: 0.85, blur: 9 },
]

/**
 * La secuencia de la red, en tres actos encadenados en una sola línea de
 * tiempo. Van juntos y no como slides separadas porque la continuidad es el
 * efecto: la misma tarjeta que se destaca en el primer acto es la que crece
 * hasta llenar la pantalla en el segundo.
 *
 *  1. Las tarjetas giran como una rueda y se apilan; entra "Hace un tiempo,
 *     <empresa>" con un degradado difuso derivando arriba.
 *  2. Los textos se van, la tarjeta pierde sus rótulos y crece hacia arriba
 *     hasta ocupar la pantalla, revelando "decidió formar parte de". Por abajo
 *     asoman las órbitas.
 *  3. Las órbitas terminan de subir y se centran: fotos girando alrededor del
 *     logo de N500 sobre un resplandor verde.
 */
export default function StoryNetwork({ slide, companyName }) {
  const root = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean)
    if (!nodes.length) return

    const ctx = gsap.context(() => {
      const apply = (el, s) =>
        gsap.set(el, {
          x: s.x,
          y: s.y,
          rotation: s.rotation,
          scale: s.scale,
          opacity: s.opacity ?? 1,
          zIndex: s.zIndex ?? 1,
          '--card-blur': `${s.blur}px`,
        })

      const seatFor = (i, spin) => seatAt((i / nodes.length) * Math.PI * 2 + spin)
      const start = -TURNS * Math.PI * 2

      nodes.forEach((el, i) => apply(el, seatFor(i, start)))
      gsap.set('[data-orbits]', { yPercent: 115, opacity: 0 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-cards]', { opacity: 0 })
        gsap.set('[data-orbits]', { yPercent: 0, opacity: 1 })
        gsap.set('[data-act1], [data-act2] [data-word], [data-float]', { opacity: 1 })
        return
      }

      const wheel = { spin: start }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // ---- Acto 1: la rueda ----
      tl.to(wheel, {
        spin: 0,
        duration: 2.9,
        ease: 'power2.inOut',
        onUpdate: () => nodes.forEach((el, i) => apply(el, seatFor(i, wheel.spin))),
      })

      nodes.forEach((el, i) => {
        if (i === 0) return
        tl.to(
          el,
          {
            ...STACK[i - 1],
            '--card-blur': `${STACK[i - 1].blur}px`,
            opacity: 1,
            zIndex: 100 - i,
            duration: 0.7,
            ease: 'power3.inOut',
          },
          `-=${i === 1 ? 0.15 : 0.45}`,
        )
      })

      tl.to(
        nodes[0],
        { x: 0, y: 0, rotation: 0, scale: 1, '--card-blur': '0px', zIndex: 200, duration: 0.7 },
        '-=1.1',
      )

      tl.from('[data-act1] [data-word]', { yPercent: 115, opacity: 0, duration: 0.6, stagger: 0.06 }, '-=0.4')
        .from('[data-float]', { scale: 0, rotation: -90, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.3')
        .to('[data-float]', { y: -12, rotation: 8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }, '<')

      // ---- Acto 2: la tarjeta crece y aparecen las órbitas ----
      tl.addLabel('crece', '+=1.4')
        .to('[data-act1]', { opacity: 0, y: -24, duration: 0.6 }, 'crece')
        // Las tarjetas del fondo se van antes que la destacada.
        .to(nodes.slice(1), { opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.06 }, 'crece')
        .to('[data-card-text]', { opacity: 0, duration: 0.5 }, 'crece')
        // La destacada crece hacia arriba: el origen abajo hace que el borde
        // superior sea el que avanza, y por eso "revela" el texto.
        .to(
          nodes[0],
          {
            scale: 2.6,
            yPercent: -34,
            duration: 1.9,
            ease: 'power2.inOut',
            transformOrigin: '50% 100%',
          },
          'crece+=0.2',
        )
        .to('[data-card-frame]', { borderRadius: 0, borderColor: 'rgba(0,0,0,0)', duration: 1.2 }, 'crece+=0.2')
        .from('[data-act2] [data-word]', { yPercent: 115, opacity: 0, duration: 0.7, stagger: 0.05 }, 'crece+=1.1')
        .to('[data-orbits]', { yPercent: 42, opacity: 1, duration: 1.6, ease: 'power2.out' }, 'crece+=0.9')

      // ---- Acto 3: las órbitas se centran ----
      tl.addLabel('orbitas', '+=1.2')
        .to('[data-act2]', { opacity: 0, y: -20, duration: 0.7 }, 'orbitas')
        .to(nodes[0], { opacity: 0, yPercent: -70, duration: 1.2, ease: 'power2.in' }, 'orbitas')
        // El degradado cálido se retira: en este acto manda el verde.
        .to('[data-gradient]', { opacity: 0.25, duration: 1.4 }, 'orbitas')
        .to('[data-orbits]', { yPercent: 0, duration: 1.8, ease: 'power2.inOut' }, 'orbitas')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    // -left-6/-right-6 anulan el padding lateral de la slide: la tarjeta, al
    // crecer, tiene que llegar a los bordes de la pantalla.
    <div ref={root} className="absolute -left-6 -right-6 bottom-0 top-0 overflow-hidden">
      {/* Degradado de dos colores, muy difuso, derivando despacio arriba. La
          máscara evita el corte recto que dejaba el `overflow-hidden`. */}
      <div
        data-gradient
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[52%] [mask-image:linear-gradient(to_bottom,#000_45%,transparent_100%)]"
      >
        <div className="absolute -left-1/4 -top-1/3 h-[420px] w-[420px] animate-drift-slow rounded-full bg-[#c94b16]/30 blur-[90px]" />
        <div className="absolute -right-1/4 -top-1/4 h-[380px] w-[380px] animate-drift-slower rounded-full bg-lime/25 blur-[90px]" />
      </div>

      {/* Acto 1 */}
      <div data-act1 className="relative flex flex-col items-center">
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/85">
          <SplitWords text={slide.kicker} />
        </p>
        <h2 className="relative mt-3 font-display text-[clamp(2.2rem,12vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-lime-pale">
          <SplitWords text={companyName} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-float
            src="/asset-green.svg"
            alt=""
            aria-hidden
            className="absolute -right-3 -top-5 w-14 drop-shadow-[0_0_14px_rgba(211,248,4,0.55)]"
          />
        </h2>
      </div>

      {/* Acto 2: queda debajo de la tarjeta hasta que ésta crece y lo descubre */}
      <p
        data-act2
        className="absolute inset-x-0 top-[30%] z-[150] text-center text-xs uppercase tracking-[0.3em] text-white"
      >
        <SplitWords text={slide.sub} />
      </p>

      {/* Las tarjetas */}
      <div data-cards className="pointer-events-none absolute inset-x-0 bottom-0 top-[38%]">
        <div className="relative mx-auto h-full w-full max-w-[420px]">
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="absolute left-1/2 top-4 h-[84%] w-[86%] -translate-x-1/2 will-change-transform"
            >
              <NetworkCard
                card={card}
                name={i === 0 ? companyName : undefined}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Las órbitas, que suben desde abajo */}
      <div data-orbits className="pointer-events-none absolute inset-0 z-[120]">
        <OrbitSystem className="absolute left-1/2 top-1/2 h-0 w-0" />
      </div>
    </div>
  )
}
