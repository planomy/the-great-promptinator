export function Toolbar({ displayMode, setDisplayMode, projectorView, setProjectorView, labels, setLabel }) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          label="Display"
          value={displayMode}
          onChange={setDisplayMode}
          options={[
            { id: 'single', label: 'Single Prompt Mode' },
            { id: 'split', label: 'Split-Screen Mode' },
          ]}
        />
        <ToggleGroup
          label="View"
          value={projectorView ? 'projector' : 'teacher'}
          onChange={(value) => setProjectorView(value === 'projector')}
          options={[
            { id: 'teacher', label: 'Teacher View' },
            { id: 'projector', label: 'Student / Projector View' },
          ]}
        />
      </div>

      {displayMode === 'split' && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <LabelField label="Left Prompt Label" value={labels.left} onChange={(v) => setLabel('left', v)} placeholder="Junior Side" />
          <LabelField label="Right Prompt Label" value={labels.right} onChange={(v) => setLabel('right', v)} placeholder="Senior Side" />
        </div>
      )}
    </div>
  )
}

function ToggleGroup({ label, value, options, onChange }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-1">
      <span className="px-2 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <div className="mt-1 flex flex-wrap gap-1">
        {options.map((option) => {
          const active = value === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active ? 'bg-violet-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function LabelField({ label, value, onChange, placeholder }) {
  return (
    <label className="rounded-xl border border-slate-700 bg-slate-900/90 p-3 text-sm">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-violet-400 focus:ring"
      />
    </label>
  )
}
