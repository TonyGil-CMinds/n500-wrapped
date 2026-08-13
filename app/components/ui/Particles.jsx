/**
 * Partículas flotantes sobre el resplandor inferior.
 *
 * Las posiciones son constantes, no aleatorias: `Math.random()` daría valores
 * distintos en servidor y cliente y rompería la hidratación.
 */
const PARTICLES = [
  { left: '26%', top: '62%', size: 3, delay: '0s', duration: '7s' },
  { left: '69%', top: '58%', size: 2, delay: '1.4s', duration: '8s' },
  { left: '32%', top: '78%', size: 2, delay: '2.1s', duration: '6.5s' },
  { left: '55%', top: '70%', size: 3, delay: '0.7s', duration: '9s' },
  { left: '44%', top: '85%', size: 2, delay: '3.2s', duration: '7.5s' },
  { left: '78%', top: '74%', size: 2, delay: '1.9s', duration: '8.5s' },
  { left: '18%', top: '71%', size: 2, delay: '2.7s', duration: '7.2s' },
  { left: '61%', top: '88%', size: 3, delay: '0.4s', duration: '6.8s' },
  { left: '37%', top: '67%', size: 2, delay: '3.8s', duration: '9.4s' },
  { left: '72%', top: '92%', size: 2, delay: '1.1s', duration: '7.8s' },
  { left: '49%', top: '76%', size: 2, delay: '4.3s', duration: '8.2s' },
  { left: '85%', top: '81%', size: 2, delay: '2.4s', duration: '6.9s' },
  { left: '13%', top: '86%', size: 2, delay: '3.5s', duration: '8.8s' },
  { left: '58%', top: '64%', size: 2, delay: '5.1s', duration: '7.1s' },
]

export default function Particles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {PARTICLES.map((p) => (
        <span
          key={`${p.left}-${p.top}`}
          className="absolute animate-drift rounded-full bg-lime-pale"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            boxShadow: '0 0 6px rgba(228, 245, 176, 0.8)',
          }}
        />
      ))}
    </div>
  )
}
