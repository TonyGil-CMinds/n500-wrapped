'use client'

import SplitWords from '../ui/SplitWords'
import { DIAGONAL_MASK } from '../../lib/mask'

/**
 * La escena de "Empresas Azules": el mar, el titular, los buzos y las dos
 * manchas.
 *
 * Igual que `GreenScene`, existe porque dos slides la pintan —`StoryBlue` la
 * construye y `StoryTypes` arranca en su último fotograma— y la costura entre
 * ambas sólo desaparece si salen del mismo marcado.
 *
 * `phase` es el estado inicial: 'enter' deja todo fuera para que la línea de
 * tiempo lo traiga, 'settled' lo deja ya colocado. Va como estilo en línea y no
 * por GSAP porque un `gsap.set` ocurre después del primer pintado, y en ese
 * fotograma se vería el estado contrario.
 */
export default function BlueScene({ kicker, headline, phase = 'settled' }) {
  const entering = phase === 'enter'
  const hidden = entering ? { opacity: 0 } : undefined

  return (
    <>
      <div
        data-blue
        className="absolute inset-0 z-20"
        style={{ '--reveal': entering ? 0 : 1, clipPath: DIAGONAL_MASK }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/empresaazul-bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      <div
        data-blue-title
        className="absolute inset-x-0 top-[15vh] z-40 flex flex-col items-center"
        style={hidden}
      >
        <p className="font-display text-[clamp(1.3rem,6.5vw,2rem)] font-extrabold uppercase tracking-tight text-white">
          <SplitWords text={kicker} />
        </p>
        <h2 className="font-display text-[clamp(3rem,17vw,5.6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-azul">
          <SplitWords text={headline} />
        </h2>
      </div>

      <div
        data-people
        className="absolute inset-x-0 bottom-0 z-50 origin-bottom will-change-transform"
        style={entering ? { transform: 'translateY(100%) scale(0.94)' } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/empresaazul-people.png" alt="" aria-hidden className="w-full" />
      </div>

      {/* Las manchas van por delante de los buzos, no detrás. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[60]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-blob
          src="/asset-bluecircle.svg"
          alt=""
          className="absolute -bottom-[5%] -left-[9%] w-[42%] origin-bottom"
          style={entering ? { opacity: 0, transform: 'scale(0.4)' } : undefined}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-blob
          src="/asset-bluesemicircles.svg"
          alt=""
          className="absolute -bottom-[3%] -right-[8%] w-[58%] origin-bottom"
          style={entering ? { opacity: 0, transform: 'scale(0.4)' } : undefined}
        />
      </div>
    </>
  )
}
