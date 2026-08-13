'use client'

import { useEffect, useRef } from 'react'

/** Número que cuenta hasta `to`. Escribe el textContent por ref, sin re-render. */
export default function CountUp({ to, durationMs = 1800, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(to)
      return
    }

    let raf
    let start
    const frame = (now) => {
      if (start === undefined) start = now
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      node.textContent = String(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [to, durationMs])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
