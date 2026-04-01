import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { ContentAdminPanel } from './components/ContentAdminPanel'
import { PromptPanel } from './components/PromptPanel'
import { SplitScreenLayout } from './components/SplitScreenLayout'
import { Toolbar } from './components/Toolbar'
import { DEFAULT_CONTENT_BANKS } from './constants/promptData'
import { mergeExtractedImageBanks } from './constants/extractedImageStarts'
import { createEmptyHistory, generatePrompt, remixJobCard } from './utils/promptEngine'

const deepClone = (value) => JSON.parse(JSON.stringify(value))

const createPanelState = (banks, overrides = {}) => {
  const baseState = {
    mode: 'narrative',
    ageBand: 'lowerSecondary',
    autoTask: true,
    customTask: '',
    variationMode: 'lockCore',
    history: createEmptyHistory(),
    ...overrides,
  }

  const generated = generatePrompt({
    mode: baseState.mode,
    ageBand: baseState.ageBand,
    autoTask: baseState.autoTask,
    customTask: baseState.customTask,
    variationMode: baseState.variationMode,
    history: baseState.history,
    banks,
  })

  return {
    ...baseState,
    output: generated.result,
    history: generated.history,
  }
}

function App() {
  const [contentBanks, setContentBanks] = useState(() => mergeExtractedImageBanks(deepClone(DEFAULT_CONTENT_BANKS)))
  const [displayMode, setDisplayMode] = useState('single')
  const [projectorView, setProjectorView] = useState(false)
  const [labels, setLabels] = useState({
    left: 'Left Prompt',
    right: 'Right Prompt',
  })
  const [panels, setPanels] = useState({
    single: createPanelState(contentBanks),
    left: createPanelState(contentBanks, { ageBand: 'upperPrimary' }),
    right: createPanelState(contentBanks, { mode: 'analytical', ageBand: 'upperSecondary' }),
  })

  const updatePanel = (panelId, patch) => {
    setPanels((prev) => ({
      ...prev,
      [panelId]: { ...prev[panelId], ...patch },
    }))
  }

  const runGenerate = (panelId) => {
    setPanels((prev) => {
      const panel = prev[panelId]
      const { result, history } = generatePrompt({
        mode: panel.mode,
        ageBand: panel.ageBand,
        autoTask: panel.autoTask,
        customTask: panel.customTask,
        variationMode: panel.variationMode,
        history: panel.history,
        banks: contentBanks,
      })
      return {
        ...prev,
        [panelId]: { ...panel, output: result, history },
      }
    })
  }

  const copyPrompt = async (panelId) => {
    const panel = panels[panelId]
    if (!panel.output) return
    const output = panel.output
    const lines = [
      `TASK`,
      `"${output.task}"`,
      '',
      `WORD TARGET`,
      `${output.wordTarget} | ${output.adjectiveTarget}`,
      '',
      `YOUR ${output.jobs.length} JOBS`,
      ...output.jobs.map((job, idx) => `${idx + 1}. ${job.concise || job.title} — e.g. ${job.conciseExample || ''}`),
      '',
      'SENTENCE STARTS',
      ...output.sentenceStarts.map((item) => `- ${item}`),
      '',
      'SENTENCE MOVES',
      ...output.sentenceMoves.map((item) => `- ${item}`),
      '',
      'DEVICE SUGGESTIONS',
      ...output.devices.map((item) => `- ${item}`),
      '',
      'AVOID THESE STARTS',
      output.avoidStarts.join(', '),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
  }

  const remixSingleCard = (panelId, cardIndex) => {
    setPanels((prev) => {
      const panel = prev[panelId]
      if (!panel?.output) return prev
      return {
        ...prev,
        [panelId]: {
          ...panel,
          output: remixJobCard({
            currentOutput: panel.output,
            mode: panel.mode,
            ageBand: panel.ageBand,
            banks: contentBanks,
            cardIndex,
          }),
        },
      }
    })
  }

  const setLabel = (side, value) => {
    setLabels((prev) => ({ ...prev, [side]: value || (side === 'left' ? 'Left Prompt' : 'Right Prompt') }))
  }

  const rebuildPanel = (banks, panel) => {
    const generated = generatePrompt({
      mode: panel.mode,
      ageBand: panel.ageBand,
      autoTask: panel.autoTask,
      customTask: panel.customTask,
      variationMode: panel.variationMode,
      history: createEmptyHistory(),
      banks,
    })
    return { ...panel, history: generated.history, output: generated.result }
  }

  const applyContentBanks = (newBanks) => {
    const safeBanks = deepClone(newBanks)
    setContentBanks(safeBanks)
    setPanels((prev) => ({
      single: rebuildPanel(safeBanks, prev.single),
      left: rebuildPanel(safeBanks, prev.left),
      right: rebuildPanel(safeBanks, prev.right),
    }))
  }

  const resetContentBanks = () => {
    const defaults = mergeExtractedImageBanks(deepClone(DEFAULT_CONTENT_BANKS))
    setContentBanks(defaults)
    setPanels((prev) => ({
      single: rebuildPanel(defaults, prev.single),
      left: rebuildPanel(defaults, prev.left),
      right: rebuildPanel(defaults, prev.right),
    }))
  }

  return (
    <AppShell projectorView={projectorView}>
      {!projectorView && (
        <>
          <Toolbar
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            projectorView={projectorView}
            setProjectorView={setProjectorView}
            labels={labels}
            setLabel={setLabel}
          />
          <ContentAdminPanel contentBanks={contentBanks} onApply={applyContentBanks} onReset={resetContentBanks} />
        </>
      )}

      {projectorView && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => setProjectorView(false)}
            className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
          >
            Exit Projector View
          </button>
        </div>
      )}

      {displayMode === 'single' ? (
        <PromptPanel
          panelId="single"
          title="Class Prompt"
          state={panels.single}
          projectorView={projectorView}
          compact={false}
          onUpdate={updatePanel}
          onGenerate={runGenerate}
          onCopy={copyPrompt}
          onRemixCard={remixSingleCard}
        />
      ) : (
        <SplitScreenLayout projectorView={projectorView}>
          <PromptPanel
            panelId="left"
            title={projectorView ? '' : labels.left || 'Left Prompt'}
            state={panels.left}
            projectorView={projectorView}
            compact
            sideTheme="junior"
            onUpdate={updatePanel}
            onGenerate={runGenerate}
            onCopy={copyPrompt}
            onRemixCard={remixSingleCard}
          />
          <PromptPanel
            panelId="right"
            title={projectorView ? '' : labels.right || 'Right Prompt'}
            state={panels.right}
            projectorView={projectorView}
            compact
            onUpdate={updatePanel}
            onGenerate={runGenerate}
            onCopy={copyPrompt}
            onRemixCard={remixSingleCard}
          />
        </SplitScreenLayout>
      )}
    </AppShell>
  )
}

export default App
