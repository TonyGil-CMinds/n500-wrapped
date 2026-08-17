'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import BlueScene from './BlueScene'
import GreenScene from './GreenScene'

/**
 * "Empresas Azules", encadenada con el final de la pantalla verde.
 *
 * Arranca exactamente en su último fotograma —de ahí que reutilice
 * `GreenScene`— y desde ahí:
 *
 *  1. Una máscara diagonal descubre el mar sobre el bosque. Va por detrás de la
 *     protagonista, así que durante un instante ella queda recortada sobre el
 *     azul.
 *  2. La protagonista se encoge hacia abajo hasta desaparecer por el borde.
 *  3. Los buzos crecen desde el borde inferior con un rebote corto.
 *  4. Ya colocado todo, entra el titular y luego las dos manchas, una a una.
 *
 * Los buzos van en la capa más alta: el titular y las manchas pasan por detrás
 * de ellos.
 */
export default function StoryBlue({ slide, sound }) {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // El estado de partida lo pone BlueScene con `phase="enter"`, así que
      // aquí sólo hace falta llevarlo a su sitio.
      if (reduced) {
        gsap.set('[data-blue]', { '--reveal': 1 })
        gsap.set('[data-people]', { yPercent: 0, y: 0, scale: 1 })
        gsap.set('[data-blob]', { scale: 1, opacity: 1 })
        gsap.set('[data-blue-title]', { opacity: 1 })
        gsap.set('[data-title]', { opacity: 0 })
        gsap.set('[data-girl]', { opacity: 0 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // El titular verde se va antes de que el azul lo alcance: vive por encima
      // del mar y si no, flotaría sobre él mientras se descubre.
      tl.to('[data-title]', { opacity: 0, duration: 0.45, ease: 'power1.in' }, 0.35)
        .to('[data-blue]', { '--reveal': 1, duration: 1.9, ease: 'power2.inOut' }, 0.9)
        // "Más pequeña hacia abajo": encoge contra su propio borde inferior, no
        // se desliza fuera, así que la cabeza baja mientras los pies no.
        .to(
          '[data-girl]',
          { scale: 0.55, yPercent: 28, opacity: 0, duration: 1, ease: 'power2.in' },
          2.1,
        )
        // `fromTo` y no `to`: el desplazamiento inicial viene de un
        // `translateY(100%)` en línea, que GSAP lee como píxeles. Animando
        // `yPercent` a 0 se quedaría el `y` en píxeles y los buzos no subirían.
        .fromTo(
          '[data-people]',
          { yPercent: 100, y: 0, scale: 0.94 },
          { yPercent: 0, scale: 1, duration: 0.75, ease: 'back.out(1.7)' },
          2.7,
        )
        .set('[data-blue-title]', { opacity: 1 }, 4.2)
        .from(
          '[data-blue-title] [data-word]',
          { yPercent: 115, opacity: 0, duration: 0.6, stagger: 0.07 },
          4.2,
        )
        // Las manchas cierran la escena, una detrás de otra.
        .to(
          '[data-blob]',
          { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.3 },
          5.2,
        )

      // El sonido va por su cuenta: la línea de tiempo sólo mueve píxeles.
      const whoosh = gsap.delayedCall(0.9, () => sound?.whoosh())
      const reveal = gsap.delayedCall(4.2, () => sound?.reveal())
      return () => {
        whoosh.kill()
        reveal.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [sound])

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden">
      {/* La escena azul se monta entre el bosque y la protagonista: el mar tiene
          que taparlo a él pero pasar por detrás de ella. Al titular, los buzos y
          las manchas los coloca su z-index, no el orden del marcado. */}
      <GreenScene kicker={slide.greenKicker} headline={slide.greenHeadline}>
        <BlueScene kicker={slide.kicker} headline={slide.headline} phase="enter" />
      </GreenScene>
    </div>
  )
}
