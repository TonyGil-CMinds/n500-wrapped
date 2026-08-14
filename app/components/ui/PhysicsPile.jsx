'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { cn } from '../../lib/cn'

/**
 * Fotos circulares que caen y se apilan unas sobre otras con física real.
 *
 * La simulación la lleva matter-js: gravedad, rebote y contactos entre
 * círculos. Resolver el apilamiento a mano —que los montones queden quietos y
 * no se hundan— exige un solver iterativo de restricciones, que es justo lo
 * que aporta el motor.
 *
 * Los cuerpos viven en el mundo de la física y el DOM sólo los refleja: en
 * cada fotograma se copia la posición y el giro de cada cuerpo a su `<img>`.
 */
export default function PhysicsPile({ items, className }) {
  const root = useRef(null)
  const nodes = useRef([])

  useEffect(() => {
    const container = root.current
    if (!container) return

    const { clientWidth: width, clientHeight: height } = container
    if (!width || !height) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const engine = Matter.Engine.create({ gravity: { y: reduce ? 0 : 1.05 } })
    const world = engine.world

    // Paredes y suelo. El suelo es el borde inferior de este contenedor, que
    // el componente padre coloca a media pantalla.
    const WALL = 200
    Matter.Composite.add(world, [
      Matter.Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, {
        isStatic: true,
      }),
      Matter.Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 3, { isStatic: true }),
      Matter.Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 3, {
        isStatic: true,
      }),
    ])

    const bodies = items.map((item, i) => {
      const r = item.size / 2
      const body = Matter.Bodies.circle(
        // Repartidas a lo ancho, con un poco de desorden estable (sin
        // Math.random: así la caída es siempre la misma).
        r + ((i * 137) % Math.max(1, width - item.size)),
        // Empiezan por encima del cuadro y escalonadas, para que caigan en
        // cascada en vez de todas a la vez.
        -r - i * 90,
        r,
        { restitution: 0.35, friction: 0.35, frictionAir: 0.012 },
      )
      Matter.Composite.add(world, body)
      return body
    })

    let raf
    const runner = () => {
      Matter.Engine.update(engine, 1000 / 60)
      bodies.forEach((body, i) => {
        const el = nodes.current[i]
        if (!el) return
        el.style.transform = `translate(${body.position.x - items[i].size / 2}px, ${
          body.position.y - items[i].size / 2
        }px) rotate(${body.angle}rad)`
      })
      raf = requestAnimationFrame(runner)
    }
    raf = requestAnimationFrame(runner)

    return () => {
      cancelAnimationFrame(raf)
      Matter.Composite.clear(world, false)
      Matter.Engine.clear(engine)
    }
  }, [items])

  return (
    <div ref={root} className={cn('relative overflow-hidden', className)}>
      {items.map((item, i) => (
        <div
          key={`${item.src}-${i}`}
          ref={(el) => {
            nodes.current[i] = el
          }}
          className="absolute left-0 top-0 will-change-transform"
          style={{ width: item.size, height: item.size }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt=""
            aria-hidden
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}
