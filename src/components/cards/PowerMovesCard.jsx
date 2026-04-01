export function PowerMovesCard({ compact = false }) {
  return (
    <section
      className={`rounded-2xl border border-sky-300/35 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <p className="text-xs uppercase tracking-[0.24em] text-sky-100">Dual Perspective + Personification</p>
      <div className={`${compact ? 'mt-2 space-y-2 text-sm md:text-base' : 'mt-3 space-y-3 text-sm md:text-base'} text-sky-50`}>
        <div className="rounded-lg border border-sky-200/25 bg-slate-900/40 p-2.5">
          <p className="font-bold text-sky-100">Dual Perspective</p>
          <p>From above, the city glittered like glass; from below, it growled with traffic and heat.</p>
        </div>
        <div className="rounded-lg border border-sky-200/25 bg-slate-900/40 p-2.5">
          <p className="font-bold text-sky-100">Personification</p>
          <p>The hallway swallowed their footsteps while the lockers watched in silence.</p>
        </div>
      </div>
    </section>
  )
}
