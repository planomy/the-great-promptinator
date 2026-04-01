function ListBlock({ title, items, tone = 'slate' }) {
  const toneClasses =
    tone === 'violet'
      ? 'border-violet-300/20 bg-violet-500/10 text-violet-100'
      : 'border-slate-600 bg-slate-900/60 text-slate-100'
  return (
    <div className={`rounded-xl border p-3 ${toneClasses}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{title}</p>
      <ul className="mt-2 space-y-1 text-sm md:text-base">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  )
}

export function StartsCard({ sentenceStarts, sentenceMoves, professionalSentences, compact = false }) {
  if (compact) {
    return (
      <section className="rounded-2xl border border-slate-600 bg-slate-900/70 p-3">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Starts + Moves</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[...sentenceStarts.slice(0, 3), ...sentenceMoves.slice(0, 2)].map((item) => (
            <span key={item} className="rounded-full border border-slate-500 bg-slate-800 px-2.5 py-1.5 text-base text-slate-100">
              {item}
            </span>
          ))}
          {!!professionalSentences.length && (
            <span className="rounded-full border border-cyan-300/30 bg-cyan-500/15 px-2.5 py-1.5 text-base text-cyan-100">
              Pro line ready
            </span>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-600 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Sentence Starts / Sentence Moves</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ListBlock title="Sentence Starts" items={sentenceStarts} />
        <ListBlock title="Model Sentence Moves" items={sentenceMoves} tone="violet" />
      </div>
      {!!professionalSentences.length && (
        <div className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-3 text-cyan-50">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Professional Sentence Bank</p>
          <ul className="mt-2 space-y-1 text-sm md:text-base">
            {professionalSentences.map((sentence) => (
              <li key={sentence}>- {sentence}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
