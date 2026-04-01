import { useMemo, useState } from 'react'

const REQUIRED_KEYS = [
  'promptBanks',
  'sentenceStarterBanks',
  'deviceBanks',
  'jobTemplateBanks',
  'modelSentenceMoves',
  'professionalSentenceBank',
  'bannedStarts',
]

export function ContentAdminPanel({ contentBanks, onApply, onReset }) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const template = useMemo(() => JSON.stringify(contentBanks, null, 2), [contentBanks])

  const loadCurrent = () => {
    setDraft(template)
    setStatus('Loaded current banks.')
  }

  const applyDraft = () => {
    try {
      const parsed = JSON.parse(draft)
      const missing = REQUIRED_KEYS.filter((key) => !(key in parsed))
      if (missing.length) {
        setStatus(`Missing keys: ${missing.join(', ')}`)
        return
      }
      onApply(parsed)
      setStatus('New content banks applied.')
    } catch {
      setStatus('Invalid JSON. Please fix formatting and try again.')
    }
  }

  return (
    <section className="mb-5 rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Content Admin</p>
          <p className="text-sm text-amber-50/90">Paste curated banks here to update the generator instantly.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="rounded-lg bg-amber-300/20 px-3 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-300/30"
        >
          {isOpen ? 'Hide' : 'Open'} Content Editor
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='Paste full JSON banks object here, then click "Apply Pasted Banks".'
            className="h-64 w-full rounded-xl border border-slate-600 bg-slate-950 p-3 font-mono text-xs text-slate-100 outline-none ring-amber-300 focus:ring"
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadCurrent} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700">
              Load Current JSON
            </button>
            <button type="button" onClick={applyDraft} className="rounded-lg bg-amber-400 px-3 py-2 text-sm font-bold text-slate-900 hover:bg-amber-300">
              Apply Pasted Banks
            </button>
            <button type="button" onClick={onReset} className="rounded-lg bg-rose-500/80 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400">
              Reset to Default Banks
            </button>
          </div>
          {status && <p className="text-xs text-amber-100">{status}</p>}
          <p className="text-xs text-amber-100/80">Required keys: {REQUIRED_KEYS.join(', ')}</p>
        </div>
      )}
    </section>
  )
}
