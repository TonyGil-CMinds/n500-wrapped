'use client'

import { useEffect, useRef } from 'react'

/**
 * Número que cuenta hasta `to`. Escribe el textContent por ref, sin re-render.
 *
 * `onTick` se llama cada `tickEvery` unidades: como el conteo va frenando, los
 * avisos se espacian solos y sirven para acompañarlo con sonido.
 */
export default function CountUp({ to, durationMs = 1800, className, onTick, tickEvery = 12 }) {
  const ref = useRef(null)
  const onTickRef = useRef(onTick)
  onTickRef.current = onTick

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(to)
      return
    }

    let raf
    let start
    let lastTick = -1
    const frame = (now) => {
      if (start === undefined) start = now
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.round(eased * to)
      node.textContent = String(value)

      const step = Math.floor(value / tickEvery)
      if (step !== lastTick) {
        lastTick = step
        onTickRef.current?.()
      }

      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [to, durationMs, tickEvery])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
