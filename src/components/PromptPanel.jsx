import { AGE_BANDS, WRITING_MODES } from '../constants/promptData'
import { DevicesCard } from './cards/DevicesCard'
import { JobsCard } from './cards/JobsCard'
import { PowerMovesCard } from './cards/PowerMovesCard'
import { StartsCard } from './cards/StartsCard'
import { TaskCard } from './cards/TaskCard'
import { WordTargetCard } from './cards/WordTargetCard'

export function PromptPanel({
  panelId,
  title,
  state,
  projectorView,
  compact = false,
  sideTheme = 'default',
  onUpdate,
  onGenerate,
  onCopy,
  onRemixCard,
}) {
  const output = state.output
  const hideProjectorHeader = projectorView && compact

  const shell = compact
    ? sideTheme === 'junior'
      ? 'border-slate-800/95 bg-slate-950 shadow-[inset_0_1px_0_0_rgba(147,197,253,0.05)]'
      : 'border-slate-800/95 bg-slate-950 shadow-[inset_0_1px_0_0_rgba(110,231,183,0.05)]'
    : 'border-slate-700 bg-slate-900/70'

  return (
    <section
      className={`rounded-2xl border ${shell} ${compact ? 'p-2.5 md:p-3' : 'p-3 md:p-4'} ${
        hideProjectorHeader ? 'flex h-full flex-col' : ''
      }`}
    >
      {!hideProjectorHeader && (
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className={`${projectorView ? 'text-2xl md:text-3xl' : 'text-xl'} font-black text-white`}>{title}</h2>
          {output && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Generated {output.generatedAt}</span>}
        </header>
      )}

      {!projectorView && (
        <div className={`mb-3 space-y-3 rounded-2xl border border-slate-700 bg-slate-950/70 ${compact ? 'p-2.5' : 'p-3'}`}>
          <div>
            <ControlTitle title="Writing Mode" />
            <div className="mt-2 flex flex-wrap gap-2">
              {WRITING_MODES.map((mode) => (
                <Chip key={mode.id} active={state.mode === mode.id} onClick={() => onUpdate(panelId, { mode: mode.id })}>
                  {mode.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <ControlTitle title="Age Band" />
            <div className="mt-2 flex flex-wrap gap-2">
              {AGE_BANDS.map((band) => (
                <Chip key={band.id} active={state.ageBand === band.id} onClick={() => onUpdate(panelId, { ageBand: band.id })}>
                  {band.label}
                </Chip>
              ))}
            </div>
          </div>

          <div className="grid gap-2 xl:grid-cols-2">
            <label className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Task Source</span>
              <select
                value={state.autoTask ? 'auto' : 'custom'}
                onChange={(e) => onUpdate(panelId, { autoTask: e.target.value === 'auto' })}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 outline-none ring-violet-400 focus:ring"
              >
                <option value="auto">Auto-generated task</option>
                <option value="custom">Custom task</option>
              </select>
            </label>

            <label className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Variation Profile</span>
              <select
                value={state.variationMode}
                onChange={(e) => onUpdate(panelId, { variationMode: e.target.value })}
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 outline-none ring-violet-400 focus:ring"
              >
                <option value="lockCore">Lock core skills</option>
                <option value="moreVariation">More variation</option>
              </select>
            </label>
          </div>

          {!state.autoTask && (
            <label className="block rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
              <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Custom Task</span>
              <input
                value={state.customTask}
                onChange={(e) => onUpdate(panelId, { customTask: e.target.value })}
                placeholder="Type your own prompt or analytical question"
                className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 outline-none ring-violet-400 focus:ring"
              />
            </label>
          )}

          <div className="flex flex-wrap gap-1.5">
            <ActionButton onClick={() => onGenerate(panelId)}>Generate</ActionButton>
            <ActionButton onClick={() => onGenerate(panelId)} styleType="secondary">
              Regenerate
            </ActionButton>
            <ActionButton onClick={() => onCopy(panelId)} styleType="ghost">
              Copy Prompt
            </ActionButton>
          </div>
        </div>
      )}

      {output && (
        <div className={`${compact ? 'space-y-2' : 'space-y-3'} ${hideProjectorHeader ? 'flex flex-1 flex-col' : ''}`}>
          <div className={`grid gap-2 ${compact ? 'xl:grid-cols-[2fr_1fr]' : ''}`}>
            <TaskCard task={output.task} projector={projectorView} compact={compact} sideTheme={sideTheme} />
            <WordTargetCard
              wordTarget={output.wordTarget}
              adjectiveTarget={output.adjectiveTarget}
              projector={projectorView}
              compact={compact}
              sideTheme={sideTheme}
            />
          </div>
          <JobsCard
            jobs={output.jobs}
            projector={projectorView}
            compact={compact}
            grow={hideProjectorHeader}
            tone={sideTheme}
            onRemix={(cardIndex) => onRemixCard(panelId, cardIndex)}
          />
          {!compact && (
            <div className="grid gap-2">
              <StartsCard
                sentenceStarts={output.sentenceStarts}
                sentenceMoves={output.sentenceMoves}
                professionalSentences={output.professionalSentences}
                compact={compact}
              />
              <DevicesCard devices={output.devices} compact={compact} mode={state.mode} ageBand={state.ageBand} />
              <PowerMovesCard />
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function ControlTitle({ title }) {
  return <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{title}</p>
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
        active ? 'border-violet-300 bg-violet-500 text-white' : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function ActionButton({ onClick, children, styleType = 'primary' }) {
  const styles = {
    primary: 'bg-violet-500 hover:bg-violet-400 text-white',
    secondary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
    ghost: 'bg-slate-800 hover:bg-slate-700 text-slate-100',
  }
  return (
    <button type="button" onClick={onClick} className={`rounded-xl px-3 py-1.5 text-xs font-bold transition md:text-sm ${styles[styleType]}`}>
      {children}
    </button>
  )
}
