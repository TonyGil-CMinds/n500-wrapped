import { cn } from '../../lib/cn'

export default function StatCard({ label, value, hint, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-surface/80 p-6 text-left shadow-lg shadow-black/40',
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</p>
      <p className="mt-3 text-4xl font-bold text-accent-soft">{value}</p>
      {hint ? <p className="mt-2 text-sm text-white/60">{hint}</p> : null}
    </div>
  )
}
