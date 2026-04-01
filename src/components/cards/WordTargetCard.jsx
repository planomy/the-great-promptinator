const shells = {
  default:
    'border-cyan-400/25 bg-slate-950/80 shadow-[inset_0_1px_0_0_rgba(103,232,249,0.1)] ring-1 ring-cyan-500/15',
  junior:
    'border-slate-700/95 bg-slate-950/85 shadow-[inset_0_1px_0_0_rgba(125,211,252,0.08)]',
  senior:
    'border-emerald-500/40 bg-slate-950/85 shadow-[inset_0_1px_0_0_rgba(94,234,212,0.09)]',
}

const labels = {
  default: 'text-cyan-300/90',
  junior: 'text-sky-300/90',
  senior: 'text-teal-300/90',
}

const compactWord = (text) => text.replace('About ', '').replace(' words', 'w')
export function WordTargetCard({ wordTarget, projector, compact = false, sideTheme = 'default' }) {
  const variant = compact ? (sideTheme === 'junior' ? 'junior' : 'senior') : 'default'
  const shell = shells[variant]
  const label = labels[variant]

  return (
    <section className={`rounded-2xl border ${shell} ${compact ? 'p-3' : 'p-4'}`}>
      <p className={`text-xs uppercase tracking-[0.24em] ${label}`}>Word Target</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill
          text={compact ? compactWord(wordTarget) : wordTarget}
          large={projector}
          compact={compact}
          variant={variant}
        />
      </div>
    </section>
  )
}

const pillStyles = {
  default: 'border-cyan-200/25 bg-cyan-400/10 text-cyan-100',
  junior: 'border-slate-600/85 bg-sky-900/45 text-sky-100',
  senior: 'border-emerald-500/40 bg-emerald-900/42 text-emerald-100',
}

function Pill({ text, large, compact, variant = 'default' }) {
  const pill = pillStyles[variant] ?? pillStyles.default
  return (
    <span
      className={`inline-flex rounded-full border font-semibold ${pill} ${
        compact ? 'px-2.5 py-1.5 text-sm md:text-base' : 'px-3 py-1.5'
      } ${compact ? '' : large ? 'text-lg md:text-2xl' : 'text-sm md:text-base'}`}
    >
      {text}
    </span>
  )
}
