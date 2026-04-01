const DEVICE_LIBRARY = {
  narrative: ['Simile', 'Metaphor', 'Imagery', 'Personification', 'Polysyndeton', 'Asyndeton', 'Synecdoche', 'Hyperbole', 'Alliteration', 'Contrast'],
  persuasive: ['Rhetorical question', 'Direct address', 'Rule of three', 'Repetition', 'Contrast', 'Call to action', 'Modal verbs', 'Counterpoint'],
  analytical: ['Evaluative qualifier', 'Interpretive hedge', 'Analytical connective', 'Authorial intent phrase', 'Micro quote integration', 'Embedded quote'],
}

const DEVICE_EXAMPLES_BY_AGE = {
  middlePrimary: {
    Simile: 'Like a drumbeat in the dark, the footsteps kept getting closer.',
    Metaphor: 'Fear was a buzzing bee in Mia chest.',
    Imagery: 'Orange light spilled across the puddles and made the street glow.',
    Personification: 'Wind tugged at the sign as if it wanted to warn us.',
    Polysyndeton: 'He ran and slipped and grabbed and climbed.',
    Asyndeton: 'No map, no torch, no backup.',
    Synecdoche: 'All eyes snapped to the opening gate.',
    Hyperbole: 'My heart jumped a million times in one second.',
    Alliteration: 'Rain rattled the rusty roof.',
    Contrast: 'Outside, the street roared; inside, the room held its breath.',
  },
  upperPrimary: {
    Simile: 'Like a snapped wire, the silence stung the whole room.',
    Metaphor: 'Panic became a drumline in his chest.',
    Imagery: 'Blue light trembled on wet concrete and broken glass.',
    Personification: 'The corridor swallowed each step and refused to echo.',
    Polysyndeton: 'She checked the lock and counted the keys and listened for movement.',
    Asyndeton: 'No warning, no witness, no way back.',
    Synecdoche: 'A row of faces turned as the latch clicked.',
    Hyperbole: 'It felt like the whole city paused to listen.',
    Alliteration: 'Cold concrete cracked beneath careless boots.',
    Contrast: 'Her hands shook, but her voice stayed steady.',
  },
  lowerSecondary: {
    Simile: 'Like a fuse racing to flame, tension ran through the crowd.',
    Metaphor: 'The alley was a throat narrowing toward danger.',
    Imagery: 'Neon reflections shivered over oil-slick asphalt.',
    Personification: 'Silence pressed against the windows, demanding an answer.',
    Polysyndeton: 'He watched and waited and measured and moved.',
    Asyndeton: 'No signal, no exits, no excuses.',
    Synecdoche: 'Every pair of eyes fixed on the torn envelope.',
    Hyperbole: 'One second stretched into an hour.',
    Alliteration: 'Steel shutters slammed in sudden sequence.',
    Contrast: 'The room looked calm, yet every voice cut sharp.',
  },
  upperSecondary: {
    Simile: 'Like static before a blackout, unease thickened across the platform.',
    Metaphor: 'Power operated as a fragile currency in the scene.',
    Imagery: 'Sodium light bled across the rain-polished pavement.',
    Personification: 'The archive breathed dust and accusation into the corridor.',
    Polysyndeton: 'She recalculated and repositioned and reframed and advanced.',
    Asyndeton: 'No alibi, no leverage, no retreat.',
    Synecdoche: 'A wall of eyes judged the hesitation.',
    Hyperbole: 'That pause felt geological in scale.',
    Alliteration: 'Faint fluorescent flicker fractured the floor.',
    Contrast: 'Public certainty collided with private panic.',
  },
}

const DEVICE_ALIASES = {
  'Rule of three': 'Polysyndeton',
  'Extended metaphor': 'Metaphor',
  'Em dash detail': 'Contrast',
  'Em dash insert': 'Contrast',
  'Sentence fragment for impact': 'Asyndeton',
  'Strategic sentence fragment': 'Asyndeton',
  'Controlled repetition': 'Polysyndeton',
  Juxtaposition: 'Contrast',
  Motif: 'Imagery',
  'Short sentence for impact': 'Asyndeton',
  'Direct recommendation': 'Call to action',
  'Concession + rebuttal': 'Counterpoint',
  'Qualified concession': 'Counterpoint',
  Antithesis: 'Contrast',
  Anaphora: 'Repetition',
  'Because sentence': 'Analytical connective',
  'Effect sentence': 'Interpretive hedge',
  'Technique + effect': 'Evaluative qualifier',
  'Quote sandwich': 'Embedded quote',
  'Analytical verb pattern': 'Evaluative qualifier',
  'Comparative phrase': 'Contrast',
  'Concluding insight': 'Authorial intent phrase',
  'Embedded clause': 'Authorial intent phrase',
  'Sophisticated analytical verb': 'Evaluative qualifier',
  'Synthesis sentence': 'Analytical connective',
}

const normalizeDevice = (device) => DEVICE_ALIASES[device] || device

const pickExample = (device, ageBand) => {
  const normalized = normalizeDevice(device)
  const bank = DEVICE_EXAMPLES_BY_AGE[ageBand] || DEVICE_EXAMPLES_BY_AGE.lowerSecondary
  return bank[normalized] || `Use ${device.toLowerCase()} once with precision.`
}

export function DevicesCard({ devices, compact = false, mode = 'narrative', ageBand = 'lowerSecondary' }) {
  const featured = compact ? devices.slice(0, 3) : devices
  const focus = DEVICE_LIBRARY[mode] || DEVICE_LIBRARY.narrative
  const requiredDevices =
    mode === 'narrative'
      ? ['Metaphor', 'Synecdoche']
      : featured.length >= 2
        ? [featured[0], featured[1]]
        : ['Metaphor', 'Rule of three']

  return (
    <section className={`rounded-2xl border border-indigo-500/25 bg-slate-900/75 ${compact ? 'p-3' : 'p-4'}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-indigo-200">Literary Devices</p>
      <p className={`${compact ? 'mt-2 text-base md:text-lg' : 'mt-2 text-sm md:text-base'} font-bold text-indigo-50`}>
        Include 1 {requiredDevices[0].toLowerCase()} and 1 {requiredDevices[1].toLowerCase()}.
      </p>
      <div className={`mt-3 flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}>
        {focus.map((device) => (
          <span
            key={device}
            className={`rounded-full border border-fuchsia-400/35 bg-fuchsia-500/70 ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs md:text-sm'} font-black uppercase tracking-wide text-white`}
          >
            {device}
          </span>
        ))}
      </div>
      <div className={`mt-3 grid gap-2 ${compact ? '' : 'md:grid-cols-2'}`}>
        {[requiredDevices[0], requiredDevices[1]].map((device) => (
          <div key={device} className="rounded-xl border border-indigo-400/25 bg-slate-950/70 p-2.5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-200">{device}</p>
            <p className={`${compact ? 'mt-1 text-base md:text-lg' : 'mt-1 text-sm md:text-base'} text-indigo-100`}>
              e.g. {pickExample(device, ageBand)}
            </p>
          </div>
        ))}
      </div>
      {!compact && featured.length > 0 && (
        <p className="mt-2 text-xs text-slate-300">Today's generated focus: {featured.join(' • ')}</p>
      )}
    </section>
  )
}
