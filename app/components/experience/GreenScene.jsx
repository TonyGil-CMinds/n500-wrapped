'use client'

import SplitWords from '../ui/SplitWords'
import { DIAGONAL_MASK } from '../../lib/mask'

/**
 * La escena de "Empresas Verdes": foto del bosque, la protagonista y el
 * titular.
 *
 * Vive aparte porque dos slides la pintan: `StoryCount` la levanta desde abajo
 * al final del contador y `StoryBlue` arranca justo en ese fotograma. El corte
 * entre ambas no se nota únicamente si el último fotograma de una y el primero
 * de la otra son idénticos al píxel, y eso sólo está garantizado si sale del
 * mismo marcado.
 *
 * `children` se cuela entre el fondo y la protagonista: es donde StoryBlue mete
 * su panel azul, que tiene que tapar el bosque pero pasar por detrás de ella.
 *
 * `revealed` es el valor inicial de la máscara: 0 en StoryCount, que la descubre
 * durante la slide, y 1 en StoryBlue, que arranca con ella ya puesta. Va como
 * estilo en línea y no por GSAP porque un `gsap.set` ocurre después del primer
 * pintado, y en ese fotograma se vería la escena en el estado contrario.
 */
export default function GreenScene({ kicker, headline, revealed = 1, children }) {
  return (
    <>
      {/*
        El fondo no se mueve: lo descubre una máscara diagonal. Ver `lib/mask`.
      */}
      <div
        data-green
        className="absolute inset-0 z-20"
        style={{ '--reveal': revealed, clipPath: DIAGONAL_MASK }}
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

      {children}

      {/*
        La protagonista y las hojas van en su propia capa, a la medida de la
        pantalla. Dentro del panel heredaban su sobredimensión y salía
        ampliada un 24 % y desplazada hacia abajo.
      */}
      <div
        data-girl
        className="absolute inset-x-0 bottom-0 z-20 origin-bottom will-change-transform"
      >
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

      <div data-title className="absolute inset-x-0 top-[13vh] z-30 flex flex-col items-center">
        <p className="font-display text-[clamp(1.3rem,6.5vw,2rem)] font-extrabold uppercase tracking-tight text-white">
          <SplitWords text={kicker} />
        </p>
        <h2 className="font-display text-[clamp(3rem,17vw,5.6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-lime">
          <SplitWords text={headline} />
        </h2>
      </div>
    </>
  )
}
