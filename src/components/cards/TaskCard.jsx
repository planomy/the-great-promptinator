const shells = {
  default:
    'border-violet-400/25 bg-slate-950/80 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.12)] ring-1 ring-violet-500/15',
  junior:
    'border-slate-700/95 bg-slate-950/85 shadow-[inset_0_1px_0_0_rgba(147,197,253,0.08)]',
  senior:
    'border-emerald-500/40 bg-slate-950/85 shadow-[inset_0_1px_0_0_rgba(110,231,183,0.09)]',
}

const labels = {
  default: 'text-violet-300/90',
  junior: 'text-blue-300/90',
  senior: 'text-emerald-300/90',
}

export function TaskCard({ task, projector, compact = false, sideTheme = 'default' }) {
  const variant = compact ? (sideTheme === 'junior' ? 'junior' : 'senior') : 'default'
  const shell = shells[variant]
  const label = labels[variant]

  return (
    <section className={`rounded-2xl border ${shell} ${compact ? 'p-3' : 'p-4 md:p-5'}`}>
      <p className={`text-xs uppercase tracking-[0.24em] ${label}`}>Task</p>
      <p
        className={`${compact ? 'text-xl md:text-2xl' : projector ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'} mt-2 font-bold leading-tight tracking-tight text-white`}
      >
        &quot;{task}&quot;
      </p>
    </section>
  )
}
