export function JobsCard({ jobs, projector, compact = false, grow = false, tone = 'default', onRemix }) {
  const title = `Your ${jobs.length} Jobs`
  const palette =
    tone === 'junior'
      ? {
          section:
            'relative overflow-hidden border border-slate-800/95 bg-slate-950 shadow-[inset_0_1px_0_0_rgba(147,197,253,0.12)] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(ellipse_100%_50%_at_50%_-6%,rgba(59,130,246,0.16),transparent_56%)]',
          title: 'text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-200/90',
          card: 'relative rounded-xl border border-slate-700/95 bg-[linear-gradient(180deg,rgba(30,58,138,0.28)_0%,rgba(15,23,42,0.95)_100%)] p-3 shadow-[inset_0_1px_0_0_rgba(147,197,253,0.08)]',
          badge:
            'shrink-0 rounded-full border border-slate-600/90 bg-blue-950/70 text-[17px] font-semibold tabular-nums text-white shadow-[inset_0_1px_0_0_rgba(147,197,253,0.12)] transition hover:border-slate-500/90',
          example: 'text-lg font-medium leading-snug text-sky-200/95 md:text-xl md:text-2xl',
          desc: 'text-blue-100/90',
          exampleLine: 'text-blue-200/85',
        }
      : {
          section:
            'relative overflow-hidden border border-emerald-700/55 bg-slate-950 shadow-[inset_0_1px_0_0_rgba(110,231,183,0.1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(ellipse_100%_50%_at_50%_-6%,rgba(16,185,129,0.14),transparent_56%)]',
          title: 'text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200/90',
          card: 'relative rounded-xl border border-emerald-500/45 bg-[linear-gradient(180deg,rgba(6,95,70,0.42)_0%,rgba(4,120,87,0.18)_100%)] p-3 shadow-[inset_0_1px_0_0_rgba(110,231,183,0.11)]',
          badge:
            'shrink-0 rounded-full border border-emerald-500/42 bg-emerald-900/65 text-[17px] font-semibold tabular-nums text-white shadow-[inset_0_1px_0_0_rgba(167,243,208,0.15)] transition hover:border-emerald-400/55',
          example: 'text-lg font-medium leading-snug text-emerald-100/95 md:text-xl md:text-2xl',
          desc: 'text-emerald-100',
          exampleLine: 'text-emerald-200/85',
        }

  return (
    <section className={`rounded-2xl p-4 ${palette.section} ${grow ? 'flex flex-1 flex-col' : ''}`}>
      <p className={`relative z-10 ${palette.title}`}>{title}</p>
      <ol className={`relative z-10 mt-3 ${compact ? 'grid gap-2 md:grid-cols-2' : 'space-y-2'} ${grow ? 'flex-1' : ''}`}>
        {jobs.map((job, index) => (
          <li key={job.id} className={palette.card}>
            {compact ? (
              <div className="flex flex-col">
                <p className="flex items-start gap-3 text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                  <button
                    type="button"
                    onClick={() => onRemix?.(index)}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-1 ${palette.badge}`}
                    title="Remix this card"
                  >
                    {index + 1}
                  </button>
                  <span>{job.concise || job.title}</span>
                </p>
                {job.conciseExample && (
                  <p className={`mt-4 md:mt-5 ${palette.example}`}>e.g. {job.conciseExample}</p>
                )}
              </div>
            ) : (
              <>
                <p className={`${projector ? 'text-xl md:text-2xl' : 'text-base md:text-lg'} font-bold text-white`}>
                  {index + 1}. {job.title}
                </p>
                <p className={`${projector ? 'text-base md:text-xl' : 'text-sm md:text-base'} mt-1 ${palette.desc}`}>
                  {job.description}
                </p>
                {job.example && <p className={`mt-1 text-xs md:text-sm ${palette.exampleLine}`}>{job.example}</p>}
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
