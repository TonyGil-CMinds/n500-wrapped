'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Tres órbitas concéntricas con las empresas de la red girando alrededor del
 * logo de N500.
 *
 * Cada anillo gira a su ritmo y en sentidos alternos. El contenido de cada
 * pieza lleva un giro inverso de la misma duración, así que las fotos orbitan
 * pero no dan vueltas sobre sí mismas.
 */
const RINGS = [
  {
    size: 430,
    duration: 54,
    reverse: false,
    items: [
      { type: 'photo', src: '/regavni-image.png', angle: 318, size: 64 },
      { type: 'asset', src: '/circle-blue.svg', angle: 22, size: 44 },
      { type: 'photo', src: '/Ocean-image.png', angle: 252, size: 58 },
      { type: 'asset', src: '/green-star.svg', angle: 128, size: 50 },
    ],
  },
  {
    size: 288,
    duration: 38,
    reverse: true,
    items: [
      { type: 'photo', src: '/litrodeluz-image.png', angle: 12, size: 62 },
      { type: 'photo', src: '/blur-image.png', angle: 158, size: 56 },
      { type: 'asset', src: '/asset-green.svg', angle: 250, size: 42 },
    ],
  },
  {
    size: 186,
    duration: 30,
    reverse: false,
    items: [{ type: 'asset', src: '/asset-orange.svg', angle: 205, size: 30 }],
  },
]

export default function OrbitSystem({ className }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      root.current.querySelectorAll('[data-spin]').forEach((ring) => {
        const duration = Number(ring.dataset.duration)
        const dir = ring.dataset.reverse === 'true' ? -1 : 1

        gsap.to(ring, { rotation: 360 * dir, duration, ease: 'none', repeat: -1 })
        // Giro inverso del contenido: cancela el del anillo y las fotos
        // quedan siempre derechas.
        gsap.to(ring.querySelectorAll('[data-upright]'), {
          rotation: -360 * dir,
          duration,
          ease: 'none',
          repeat: -1,
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className={className}>
      {RINGS.map((ring) => (
        <div
          key={ring.size}
          data-ring
          className="absolute left-1/2 top-1/2 rounded-full border border-lime/35"
          style={{
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
          }}
        >
          <div
            data-spin
            data-duration={ring.duration}
            data-reverse={String(ring.reverse)}
            className="absolute inset-0"
          >
            {ring.items.map((item) => (
              <div
                key={`${item.src}-${item.angle}`}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${item.angle}deg) translateY(${-ring.size / 2}px)` }}
              >
                <div
                  data-orbit-item
                  data-upright
                  className="-translate-x-1/2 -translate-y-1/2"
                  style={{ width: item.size, height: item.size }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden
                    className={
                      item.type === 'photo'
                        ? 'h-full w-full rounded-full object-cover ring-1 ring-lime/30'
                        : 'h-full w-full object-contain'
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Centro: el logo sobre un resplandor verde.
          Se centra con márgenes negativos, igual que los anillos. Con un grid
          de 0x0 y `place-items-center` los hijos se colocaban desde la esquina
          y quedaban desplazados medio ancho. */}
      <div className="absolute left-1/2 top-1/2">
        <div
          aria-hidden
          data-orbit-glow
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          /* El halo se abre en anillo: apagado en el centro, donde va el logo.
             Con el máximo en el centro, el logo —lima pálido— se perdía. */
          style={{
            width: 208,
            height: 208,
            background:
              'radial-gradient(circle, rgba(211,248,4,0.06) 0%, rgba(211,248,4,0.28) 42%, transparent 72%)',
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-full.svg"
          alt="N500"
          data-orbit-logo
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
          /*
            `maxWidth: none` es imprescindible. El preflight de Tailwind pone
            `img { max-width: 100% }`, y el 100% se mide contra el ancestro
            posicionado, que aquí mide cero: el logo se quedaba en 0 px de
            ancho por mucho que se le diera un ancho por clase o por estilo.
          */
          style={{ width: 104, height: 26, maxWidth: 'none' }}
        />
      </div>
    </div>
  )
}
