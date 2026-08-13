'use client'

import { useEffect, useRef } from 'react'
import { cn } from '../../lib/cn'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

/**
 * Contador tipo odómetro mecánico.
 *
 * Cada posición es una columna con los dígitos 0-9 apilados que se desplaza
 * verticalmente. La posición se calcula de forma continua —(valor / 10^p) % 10—
 * así que las ruedas giran en vez de saltar de número en número.
 *
 * El truco del wrap: la columna repite el "0" al final, y como el contenido es
 * periódico cada 10 dígitos, aplicar el módulo es visualmente invisible.
 *
 * Se anima con rAF escribiendo el transform directamente sobre el DOM: a 60fps
 * un setState por frame sería mucho más caro y no aporta nada.
 */
export default function Odometer({
  to,
  places = 3,
  durationMs = 3200,
  onTick,
  onDone,
  className,
  /**
   * Ancho de cada cifra, en el orden en que se pintan. Sirve para que las
   * ruedas caigan exactamente donde luego irán los caracteres del logotipo,
   * y el relevo entre ambos no mueva nada.
   */
  widths,
}) {
  const columnsRef = useRef([])
  const wrapperRef = useRef(null)
  const onTickRef = useRef(onTick)
  const onDoneRef = useRef(onDone)

  onTickRef.current = onTick
  onDoneRef.current = onDone

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let start
    let lastTickAt = -1

    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    /**
     * @param value  posición actual del contador
     * @param speed  velocidad instantánea en unidades/segundo; de ella sale el
     *               desenfoque, para que cada rueda se emborrone sólo mientras
     *               gira rápido y se vaya afilando al frenar.
     */
    const paint = (value, speed) => {
      for (let p = 0; p < places; p++) {
        const col = columnsRef.current[p]
        if (!col) continue
        const pos = (value / 10 ** p) % 10
        // Cada dígito ocupa 1/11 de la altura de la columna.
        col.style.transform = `translateY(${(-pos * 100) / DIGITS.length}%)`

        const digitSpeed = (speed / 10 ** p) * 0.05
        col.style.filter =
          digitSpeed > 0.6 ? `blur(${Math.min(digitSpeed, 7).toFixed(1)}px)` : 'none'
      }
    }

    const frame = (now) => {
      if (start === undefined) start = now
      const t = Math.min((now - start) / durationMs, 1)
      const value = easeOut(t) * to
      // Derivada de easeOut: 3(1-t)^2, escalada a unidades por segundo.
      const speed = (to * 3 * (1 - t) ** 2) / (durationMs / 1000)
      paint(value, speed)

      const step = Math.floor(value / 25)
      if (step !== lastTickAt) {
        lastTickAt = step
        onTickRef.current?.()
      }

      if (t < 1) {
        raf = requestAnimationFrame(frame)
      } else {
        for (const col of columnsRef.current) if (col) col.style.filter = 'none'
        onDoneRef.current?.()
      }
    }

    if (reduced) {
      paint(to, 0)
      onDoneRef.current?.()
      return
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [to, places, durationMs])

  // Las columnas se pintan de la más significativa a la menos.
  const positions = Array.from({ length: places }, (_, i) => places - 1 - i)

  return (
    <div
      ref={wrapperRef}
      className={cn('flex tabular-nums', className)}
      role="status"
      aria-label={`Cargando, contando hasta ${to}`}
    >
      {positions.map((p, i) => (
        <span
          key={p}
          className="relative block h-[1em] overflow-hidden text-center"
          style={widths ? { width: widths[i] } : undefined}
          aria-hidden
        >
          <span
            ref={(el) => {
              columnsRef.current[p] = el
            }}
            className="block will-change-transform"
          >
            {DIGITS.map((d, i) => (
              <span key={i} className="block h-[1em] leading-none">
                {d}
              </span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}
