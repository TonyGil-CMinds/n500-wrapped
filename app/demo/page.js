import AudioPlayer from '../components/ui/AudioPlayer'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import { allTracks } from '../lib/audio'

export const metadata = {
  title: 'Demo · N500 Wrapped',
  description: 'Comprobación de que la estructura del proyecto funciona.',
}

const checks = [
  ['App Router', 'Esta ruta es app/demo/page.js — un Server Component.'],
  ['Layout global', 'El fondo oscuro y la fuente vienen de app/layout.js.'],
  ['Tailwind', 'Colores del tema (accent, ink, surface) definidos en tailwind.config.cjs.'],
  ['Componentes', 'Button, StatCard y AudioPlayer desde app/components/.'],
  ['Client Component', 'AudioPlayer lleva "use client" y usa estado y refs.'],
  ['public/', 'Los .wav se sirven desde /audio/*.wav sin importarlos.'],
]

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="animate-fade-up">
        <p className="text-xs uppercase tracking-[0.3em] text-accent-soft">Demo técnica</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Todo en su sitio</h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Si ves colores del tema, animaciones y el audio se reproduce, la estructura
          (<code className="text-accent-soft">app/</code> +{' '}
          <code className="text-accent-soft">public/</code>) está funcionando.
        </p>
      </header>

      <section className="mt-14">
        <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">1 · Componentes de UI</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard label="Sesiones" value="1 284" hint="+38% vs. el año pasado" />
          <StatCard label="Minutos" value="9 412" hint="Tu racha más larga: 11 días" />
          <StatCard label="Top track" value="#1" hint="Glorious Imperfection" />
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button>Botón primario</Button>
          <Button variant="ghost">Botón ghost</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">
          2 · Audio desde <code>public/audio</code>
        </h2>
        <div className="mt-5 space-y-4">
          {allTracks.map((track) => (
            <AudioPlayer key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-sm uppercase tracking-[0.2em] text-white/50">3 · Checklist</h2>
        <ul className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface/60">
          {checks.map(([title, detail]) => (
            <li key={title} className="flex gap-4 p-5">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime/20 text-xs text-lime">
                ✓
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-white/60">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-14">
        <Button as="a" href="/" variant="ghost">
          ← Volver al inicio
        </Button>
      </footer>
    </main>
  )
}
