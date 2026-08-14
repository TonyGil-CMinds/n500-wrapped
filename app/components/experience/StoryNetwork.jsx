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
export default function StoryNetwork({ slide, companyName, sound }) {
  const root = useRef(null)
  const cardRefs = useRef([])
  // En una ref para que el efecto no dependa de la identidad del objeto.
  const soundRef = useRef(sound)
  soundRef.current = sound

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

      // Arrancan encogidas e invisibles: entran una a una antes de girar.
      nodes.forEach((el, i) => {
        const seat = seatFor(i, start)
        apply(el, { ...seat, opacity: 0, scale: seat.scale * 0.55 })
      })
      // Las órbitas esperan desmontadas visualmente: se revelan pieza a pieza.
      gsap.set('[data-ring]', { scale: 0.75, opacity: 0 })
      gsap.set('[data-orbit-item]', { scale: 0, opacity: 0 })
      gsap.set('[data-orbit-glow], [data-orbit-logo]', { opacity: 0, scale: 0.7 })
      gsap.set('[data-veil]', { yPercent: 100 })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-cards], [data-act1], [data-act2]', { opacity: 0 })
        gsap.set('[data-veil]', { yPercent: 0 })
        gsap.set('[data-ring], [data-orbit-item], [data-orbit-glow], [data-orbit-logo]', {
          scale: 1,
          opacity: 1,
        })
        return
      }

      const wheel = { spin: start }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // El degradado entra fundiéndose, no aparece de golpe con la slide.
      tl.from('[data-gradient]', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)

      // ---- Las tarjetas entran una a una ----
      tl.to(
        nodes,
        {
          opacity: (i) => seatFor(i, start).opacity,
          scale: (i) => seatFor(i, start).scale,
          duration: 0.5,
          stagger: 0.14,
          ease: 'back.out(1.6)',
          onStart: () => soundRef.current?.card(),
        },
        0.15,
      )

      // ---- Acto 1: la rueda ----
      // Un tic por cada tarjeta que pasa por delante. Como el giro frena, los
      // tics se van espaciando solos, igual que en una ruleta.
      let seatsPassed = 0
      const seatArc = (Math.PI * 2) / nodes.length

      tl.to(wheel, {
        spin: 0,
        duration: 2.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          nodes.forEach((el, i) => apply(el, seatFor(i, wheel.spin)))

          const passed = Math.floor((wheel.spin - start) / seatArc)
          if (passed > seatsPassed) {
            seatsPassed = passed
            soundRef.current?.card()
          }
        },
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

      // ---- La tarjeta crece de una sola vez, sin pararse a medio camino ----
      tl.addLabel('crece', '+=1.2')
        .to(nodes.slice(1), { opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.05 }, 'crece')
        .to('[data-card-text]', { opacity: 0, duration: 0.4 }, 'crece')
        .to('[data-act1]', { opacity: 0, duration: 0.6 }, 'crece+=0.6')
        // Con el origen abajo es el borde superior el que avanza, y por eso va
        // tapando el titular en vez de empujarlo.
        .to(
          nodes[0],
          { scale: 3.4, duration: 2.6, ease: 'power2.inOut', transformOrigin: '50% 100%' },
          'crece+=0.1',
        )
        .to(
          '[data-card-frame]',
          { borderRadius: 0, borderColor: 'rgba(0,0,0,0)', duration: 1.1 },
          'crece+=0.7',
        )
        .from(
          '[data-act2] [data-word]',
          { yPercent: 115, opacity: 0, duration: 0.6, stagger: 0.04 },
          'crece+=1.7',
        )

      // ---- El velo oscuro sube y se lleva imagen y texto por delante ----
      tl.addLabel('velo', '+=0.7')
        .to('[data-veil]', { yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, 'velo')
        .to('[data-gradient]', { opacity: 0, duration: 1 }, 'velo')
        .to('[data-act2]', { opacity: 0, duration: 0.5 }, 'velo+=0.35')
        .to(nodes[0], { opacity: 0, duration: 0.5 }, 'velo+=0.8')

      // ---- Y detrás del velo se revelan las órbitas, pieza a pieza ----
      tl.addLabel('orbitas', 'velo+=0.75')
        .to('[data-ring]', { scale: 1, opacity: 1, duration: 0.7, stagger: 0.16 }, 'orbitas')
        .to(
          '[data-orbit-item]',
          { scale: 1, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(2.4)' },
          'orbitas+=0.45',
        )
        .to('[data-orbit-glow]', { opacity: 1, scale: 1, duration: 0.9 }, 'orbitas+=1.15')
        .to(
          '[data-orbit-logo]',
          { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
          'orbitas+=1.3',
        )

      // ---- Cierre: la oscuridad se come las órbitas ----
      //
      // Se coloca en tiempo absoluto contado desde el final de la slide, no
      // relativo a la etiqueta anterior. Encadenado, el velo terminaba después
      // del cambio de slide y las órbitas asomaban un instante; así queda
      // negro del todo casi un segundo antes, pase lo que pase por delante.
      const OUTRO_MS = 1200
      const outroAt = Math.max(0, (slide.ms - OUTRO_MS - 900) / 1000)
      tl.to('[data-outro]', { opacity: 1, duration: OUTRO_MS / 1000, ease: 'power2.in' }, outroAt)
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

      {/* Acto 1. Arranca al 19% para no pisar la barra de progreso ni los
          controles, que van por encima en la cabecera. */}
      <div data-act1 className="absolute inset-x-0 top-[19%] flex flex-col items-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/85">
          <SplitWords text={slide.kicker} />
        </p>
        {/* El ancho máximo obliga a partir el nombre en dos líneas, como en la
            referencia, y deja sitio al destello sin que se salga de cuadro. */}
        <h2 className="relative mx-auto mt-3 max-w-[290px] font-display text-[clamp(2rem,11.5vw,3.6rem)] font-extrabold uppercase leading-[0.95] tracking-tight text-lime-pale">
          <SplitWords text={companyName} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-float
            src="/asset-green.svg"
            alt=""
            aria-hidden
            className="absolute -right-7 -top-4 w-12 drop-shadow-[0_0_14px_rgba(211,248,4,0.55)]"
          />
        </h2>
      </div>

      {/* Acto 2: queda debajo de la tarjeta hasta que ésta crece y lo descubre */}
      <p
        data-act2
        /* Por encima de las tarjetas: la destacada llega a z-index 200 durante
           la rueda, y con un valor menor este texto quedaba debajo. */
        className="absolute inset-x-0 top-[30%] z-[300] text-center text-xs uppercase tracking-[0.3em] text-white"
      >
        <SplitWords text={slide.sub} />
      </p>

      {/* Las tarjetas. Cada una se centra en el viewport y desde ahí GSAP la
          desplaza por la rueda: así el eje de giro queda en mitad de pantalla
          y no dentro de una caja con márgenes. Formato vertical, y el borde
          inferior se sale de cuadro como en la referencia. */}
      <div data-cards className="pointer-events-none absolute inset-0">
        {cards.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="absolute left-1/2 top-1/2 h-[48vh] w-[76%] max-w-[310px] -translate-x-1/2 will-change-transform"
          >
            <NetworkCard
              card={card}
              name={i === 0 ? companyName : undefined}
              className="h-full w-full"
            />
          </div>
        ))}
      </div>

      {/* Velo oscuro que sube y tapa imagen y texto. Por encima de todo lo
          anterior (la tarjeta llega a z-index 200 y el texto a 300). */}
      <div
        data-veil
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[350]"
        style={{
          background:
            'linear-gradient(to top, #101511 0%, #101511 62%, rgba(16,21,17,0.85) 82%, transparent 100%)',
        }}
      />

      {/* Las órbitas se revelan sobre el velo */}
      <div data-orbits className="pointer-events-none absolute inset-0 z-[400]">
        <OrbitSystem className="absolute left-1/2 top-1/2 h-0 w-0" />
      </div>

      {/* Oscuridad final: entra sobre todo lo demás para cerrar la slide */}
      <div
        data-outro
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[500] bg-ink opacity-0"
      />
    </div>
  )
}
