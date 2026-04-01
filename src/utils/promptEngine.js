import { AGE_BANDS, DEFAULT_CONTENT_BANKS } from '../constants/promptData'

const HISTORY_LIMIT = 8

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const trimHistory = (arr) => arr.slice(-HISTORY_LIMIT)

const weightedUniquePick = (items, count, recentIds = [], variationBoost = 1.2) => {
  const picks = []
  const pool = [...items]
  while (picks.length < count && pool.length > 0) {
    const weights = pool.map((item) => {
      const repeatedPenalty = recentIds.includes(item.id) ? 0.3 : 1
      return Math.max((item.weight ?? 1) * repeatedPenalty * variationBoost, 0.1)
    })
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let roll = Math.random() * totalWeight
    let chosenIndex = 0
    for (let i = 0; i < weights.length; i += 1) {
      roll -= weights[i]
      if (roll <= 0) {
        chosenIndex = i
        break
      }
    }
    picks.push(pool[chosenIndex])
    pool.splice(chosenIndex, 1)
  }
  return picks
}

const pickTask = ({ mode, ageBand, autoTask, customTask, recentTaskIds, banks }) => {
  if (!autoTask && customTask.trim()) {
    return { id: `custom-${customTask.trim().toLowerCase()}`, text: customTask.trim(), custom: true }
  }
  const bank = banks.promptBanks[mode][ageBand]
  const fresh = bank.filter((task) => !recentTaskIds.includes(task.id))
  const source = fresh.length ? fresh : bank
  return randomItem(source)
}

const pickJobs = ({ mode, ageBand, variationMode, recentJobIds, banks }) => {
  const bank = banks.jobTemplateBanks[mode][ageBand]
  const coreJobs = bank.filter((job) => job.core)
  const flexJobs = bank.filter((job) => !job.core)
  const coreCount = variationMode === 'lockCore' ? 3 : 1
  const flexCount = 6 - coreCount
  const sortedCore = [...coreJobs].sort((a, b) => b.weight - a.weight)
  const stableCore = sortedCore.slice(0, coreCount)
  const rotatingCorePool = variationMode === 'lockCore' ? [] : coreJobs.filter((job) => !stableCore.some((c) => c.id === job.id))
  const rotatingPool = [...flexJobs, ...rotatingCorePool]
  const variationBoost = variationMode === 'moreVariation' ? 1.4 : 1.05
  const rotatingJobs = weightedUniquePick(rotatingPool, flexCount, recentJobIds, variationBoost)
  return [...stableCore, ...rotatingJobs].slice(0, 6)
}

const pickJobsWithHistory = ({ mode, ageBand, variationMode, recentJobIds, recentJobCombos, banks }) => {
  let chosen = pickJobs({ mode, ageBand, variationMode, recentJobIds, banks })
  let signature = chosen.map((job) => job.id).sort().join('|')
  let attempts = 0
  while (recentJobCombos.includes(signature) && attempts < 4) {
    chosen = pickJobs({ mode, ageBand, variationMode, recentJobIds, banks })
    signature = chosen.map((job) => job.id).sort().join('|')
    attempts += 1
  }
  return { jobs: chosen, signature }
}

const pickSentenceContent = ({ mode, ageBand, recentSentencePackIds, banks }) => {
  const starts = banks.sentenceStarterBanks[mode][ageBand]
  const moves = banks.modelSentenceMoves[mode][ageBand]
  const professional = banks.professionalSentenceBank[mode]?.[ageBand] ?? []
  const startPool = starts.filter((entry) => !recentSentencePackIds.includes(entry.id))
  const selectedStarts = weightedUniquePick(startPool.length ? startPool : starts, 5, recentSentencePackIds, 1.2)
  const movePool = moves.filter((entry) => !recentSentencePackIds.includes(entry.id))
  const selectedMoves = weightedUniquePick(movePool.length ? movePool : moves, 3, recentSentencePackIds, 1.1)
  const selectedProfessional = professional.length ? [randomItem(professional)] : []
  return {
    sentenceStarts: selectedStarts.map((entry) => entry.text),
    sentenceMoves: selectedMoves.map((entry) => entry.text),
    professionalSentences: selectedProfessional.map((entry) => entry.text),
    sentenceIds: [...selectedStarts, ...selectedMoves].map((entry) => entry.id),
  }
}

const pickDevices = ({ mode, ageBand, recentDeviceIds, banks }) => {
  const devices = banks.deviceBanks[mode][ageBand]
  const pool = devices.filter((item) => !recentDeviceIds.includes(item.id))
  return weightedUniquePick(pool.length ? pool : devices, 4, recentDeviceIds, 1.15)
}

const getStartCardInstruction = () => 'Start with a great action sentence.'

const conciseInstruction = (job, adjectiveTarget, mode, ageBand) => {
  const text = `${job.title} ${job.description}`.toLowerCase()
  const isJunior = ageBand === 'middlePrimary' || ageBand === 'upperPrimary'
  const startersTarget = isJunior ? 2 : 3
  const activeVerbTarget = isJunior ? 3 : 4

  if (text.includes('purposeful opening') || text.includes('open') || text.includes('begin')) {
    return getStartCardInstruction(mode)
  }
  if (text.includes('adjective') || text.includes('descriptor') || text.includes('modifier')) {
    return `Use ${adjectiveTarget.replace(' adjectives', ' describing words')}.`
  }
  if (text.includes('active verb')) return `Use ${activeVerbTarget} great active verbs.`
  if (text.includes('mood')) return 'Include sound and touch detail.'
  if (text.includes('past tense')) return `Use ${activeVerbTarget} great active verbs.`
  if (text.includes('present tense')) return 'Use present tense all the way through.'
  if (text.includes('control voice and tense')) {
    return mode === 'analytical' ? 'Use present tense and third person.' : 'Zero was/were. Keep one tense.'
  }
  if (text.includes('fragment') || text.includes('syntax')) return 'Include 1 short fragment line.'
  if (text.includes('device') || text.includes('rhetoric')) return 'Include 1 metaphor and 1 synecdoche.'
  if (text.includes('imagery') || text.includes('sensory')) return 'Include sound and touch detail.'
  if (text.includes('sentence') && (text.includes('length') || text.includes('variety'))) {
    return 'Include 1 TNT sentence (under 6 words).'
  }
  if (text.includes('opinion') || text.includes('claim') || text.includes('thesis') || text.includes('contention')) {
    return 'State your claim in line 1.'
  }
  if (text.includes('evidence') || text.includes('example')) return 'Include 1 specific example.'
  if (text.includes('analytical verb')) return 'Use 2 analytical verbs.'
  if (text.includes('audience effect') || text.includes('reader/viewer impact') || text.includes('effect')) {
    return 'Explain audience effect.'
  }
  if (text.includes('starts')) return `Use ${startersTarget} sentence starters from the list.`
  if (text.includes('end') || text.includes('close') || text.includes('ending')) {
    return 'Include 1 context link: memory/place/history/recent event/childhood/trauma/loss-triumph.'
  }
  return `${job.title.replace(/\.$/, '')}.`
}

const CONTEXT_LINK = 'Include 1 context link: memory/place/history/recent event/childhood/trauma/loss-triumph.'

const SIMPLE_FALLBACK_JOBS = {
  narrative: {
    middlePrimary: [
      'Use 3 great active verbs.',
      'Include sight and sound detail.',
      'Use only 2 bad starts maximum.',
      'Use 2 sentence starters from the list.',
      'Include 1 simile and 1 metaphor.',
      CONTEXT_LINK,
      'Include 1 feeling through action.',
      'Keep one tense all the way through.',
      'Include 1 TNT sentence (under 6 words).',
    ],
    upperPrimary: [
      'Use 3 great active verbs.',
      'Include sound and touch detail.',
      'Use only 2 bad starts maximum.',
      'Use 2 sentence starters from the list.',
      'Include 1 metaphor and 1 synecdoche.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Keep one tense all the way through.',
      'Include 1 TNT sentence (under 6 words).',
      'Use 7-9 describing words.',
    ],
    lowerSecondary: [
      'Use 4 great active verbs.',
      'Include sound and touch detail.',
      'Include 1 TNT sentence (under 6 words).',
      'Zero was/were.',
      'Use only 2 bad starts maximum.',
      'Use 3 sentence starters from the list.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Use 10-12 describing words.',
      'Use 1 em-dash descriptor.',
    ],
    upperSecondary: [
      'Use 4 great active verbs.',
      'Include sound and touch detail.',
      'Include 1 TNT sentence (under 6 words).',
      'Zero was/were.',
      'Use only 2 bad starts maximum.',
      'Use 3 sentence starters from the list.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Use 14-17 describing words.',
      'Use 1 em-dash descriptor.',
    ],
  },
  persuasive: {
    middlePrimary: [
      'Give 2 strong reasons.',
      'Add 1 real example.',
      'Use 2 sentence starters from the list.',
      'Use only 2 bad starts maximum.',
      'Use 1 rhetorical question.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Use words like should or must once.',
    ],
    upperPrimary: [
      'Give 2 strong reasons.',
      'Add 1 real example.',
      'Use 2 sentence starters from the list.',
      'Use only 2 bad starts maximum.',
      'Use 1 rhetorical question.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Add 1 counterpoint sentence.',
    ],
    lowerSecondary: [
      'Give 2 strong reasons.',
      'Add 1 real example.',
      'Use 3 sentence starters from the list.',
      'Use only 2 bad starts maximum.',
      'Use 1 rhetorical question.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Add 1 counterargument and rebuttal.',
    ],
    upperSecondary: [
      'Give 2 strong reasons.',
      'Add 1 real example.',
      'Use 3 sentence starters from the list.',
      'Use only 2 bad starts maximum.',
      'Use 1 rhetorical question.',
      CONTEXT_LINK,
      'Include 1 short fragment line.',
      'Add 1 counterargument and rebuttal.',
    ],
  },
  analytical: {
    middlePrimary: [
      'Use 2 analytical verbs.',
      'Include 1 quote or scene detail.',
      'Explain the audience effect clearly.',
      'Use present tense and third person.',
      'Use 2 sentence starters from the list.',
      CONTEXT_LINK,
      'Use only 2 bad starts maximum.',
      'Include 1 short fragment line.',
      'Use one because sentence.',
    ],
    upperPrimary: [
      'Use 2 analytical verbs.',
      'Include 1 quote or scene detail.',
      'Explain the audience effect clearly.',
      'Use present tense and third person.',
      'Use 2 sentence starters from the list.',
      CONTEXT_LINK,
      'Use only 2 bad starts maximum.',
      'Include 1 short fragment line.',
      'Use one because sentence.',
    ],
    lowerSecondary: [
      'Use 2 analytical verbs.',
      'Include 1 quote or scene detail.',
      'Explain the audience effect clearly.',
      'Use present tense and third person.',
      'Use 3 sentence starters from the list.',
      CONTEXT_LINK,
      'Use only 2 bad starts maximum.',
      'Include 1 short fragment line.',
      'Use one evaluative sentence.',
    ],
    upperSecondary: [
      'Use 2 analytical verbs.',
      'Include 1 quote or scene detail.',
      'Explain the audience effect clearly.',
      'Use present tense and third person.',
      'Use 3 sentence starters from the list.',
      CONTEXT_LINK,
      'Use only 2 bad starts maximum.',
      'Include 1 short fragment line.',
      'Use one evaluative sentence.',
    ],
  },
}

const BLUE_PROFESSIONAL_SENTENCE_BANK = {
  middlePrimary: [
    { name: 'Triple Punchers', sentence: 'The door creaked open. Slow. Deliberate. Terrifying.' },
    { name: 'Triple Where', sentence: 'Over the hills, under the stars, and through the whispering winds came a lone wolf, silent and swift.' },
  ],
  upperPrimary: [
    { name: 'Nested Who', sentence: 'The old man, who spent his days by the river where he had once found a rare gem, smiled at memories only he knew.' },
    { name: 'Triple When', sentence: 'Following the speech, prior to the applause, amidst a wave of uncertainty, he made his decision.' },
  ],
  lowerSecondary: [
    { name: 'Dual Perspective', sentence: 'From above, the city sparkled like a jewel; from below, it throbbed with the ceaseless energy of survival.' },
    { name: 'Descriptive Double Each', sentence: 'The museum halls echoed with the silent steps of visitors, each room leading to another gallery, each painting drawing them deeper.' },
  ],
  upperSecondary: [
    { name: 'Role Reversal', sentence: 'The castle, once a mighty fortress, now served as a peaceful haven for artists, its walls echoing not with clashing swords but with brushes and pens.' },
    { name: 'Adverb Simile Start', sentence: 'Fiercely, the fire burned like a raging, infernal beast, its intense, searing heat consuming everything in its path.' },
  ],
}

const ACTION_SENTENCE_PATTERN_BANK = {
  middlePrimary: [
    { name: 'Verb Start', sentence: 'Racing to the gate, Maya gripped the cold handle and pushed it open.' },
    { name: 'Quadruple Verb', sentence: 'Racing along the fence line, Leo grabbed the rope, lifted the crate, and shoved it behind the curtain.' },
    { name: 'Injected Verb', sentence: 'Climbing the stairs, hearing floorboards creak beneath her shoes, Ava paused at the top.' },
    { name: 'Double Hand Sentence', sentence: 'With a torch in one hand and a crumpled map in the other, Sam stepped into the tunnel.' },
    { name: 'Double Issue Verb Start', sentence: 'Maya, battling the rain and shaking from fear, pushed the gate and slipped inside.' },
    { name: 'TNT', sentence: 'Maya froze.' },
  ],
  upperPrimary: [
    { name: 'Verb Start', sentence: 'Approaching the door, Ellie traced the carved symbols with a shaking fingertip.' },
    { name: 'Quadruple Verb', sentence: 'Climbing the spiral staircase, Ellie checked the lock, lifted the latch, and scanned the harbour below.' },
    { name: 'Injected Verb', sentence: 'Descending the stairs, feeling the storm press against the walls, she hesitated at the final step.' },
    { name: 'Double Hand Sentence', sentence: 'With a rusted key in one hand and a flickering torch in the other, he edged toward the hidden hatch.' },
    { name: 'Double Issue Verb Start', sentence: 'Ellie, battling fierce wind and choking smoke, shoved the latch and ran for cover.' },
    { name: 'TNT', sentence: 'Ellie paused.' },
  ],
  lowerSecondary: [
    { name: 'Verb Start', sentence: 'Crossing the platform, he traced the graffiti-marked railing and counted the seconds under his breath.' },
    { name: 'Quadruple Verb', sentence: 'Crossing the shattered platform, he gripped the rail, braced his shoulder, and dragged the jammed gate open.' },
    { name: 'Injected Verb', sentence: 'Stepping into the passage, sensing the stale air close around him, he fought the urge to turn back.' },
    { name: 'Double Hand Sentence', sentence: 'With his phone torch in one hand and the folded note in the other, he followed the chalk arrows into the underpass.' },
    { name: 'Double Issue Verb Start', sentence: 'Ari, battling panic and dodging shattered glass, forced the side door and sprinted into the lane.' },
    { name: 'TNT', sentence: 'Ari moved.' },
  ],
  upperSecondary: [
    { name: 'Verb Start', sentence: 'Threading through the wrecked concourse, she mapped each shadowed exit while her pulse kept time with distant alarms.' },
    { name: 'Quadruple Verb', sentence: 'Tracking the falling debris, he recalibrated the line, tightened the harness, and launched the hook across the stairwell.' },
    { name: 'Injected Verb', sentence: 'Moving down the stairwell, feeling the pressure of old panic return, he measured every footstep before committing his weight.' },
    { name: 'Double Hand Sentence', sentence: 'With the decrypted file in one hand and the blood-warm radio in the other, she advanced into the blackout corridor.' },
    { name: 'Double Issue Verb Start', sentence: 'Nia, battling crossfire and fighting tunnel vision, braced the door and drove the team through.' },
    { name: 'TNT', sentence: 'Nia committed.' },
  ],
}

const pickActionStarterExample = (ageBand) => {
  const patternBank = ACTION_SENTENCE_PATTERN_BANK[ageBand] || ACTION_SENTENCE_PATTERN_BANK.lowerSecondary
  const chosen = randomItem(patternBank)
  return `${chosen.name}: ${chosen.sentence}`
}

const DEVICE_EXAMPLES = {
  'Short sentence for impact': 'One breath. Then chaos.',
  Metaphor: 'Fear was a drumbeat behind his ribs.',
  Synecdoche: 'A wall of eyes locked on the doorway.',
  'Rule of three': 'Cold. Silent. Waiting.',
  'Extended metaphor': 'Panic kept tightening like a knot around his lungs.',
  'Em dash detail': 'Rusted and bent, the gate groaned open.',
  'Em dash insert': 'Trembling but focused, she stepped forward.',
  'Sensory pair': 'Metal scraped under her palm, and smoke stung her throat.',
  'Symbolic detail': 'His cracked watch sat at 11:59, refusing to move on.',
  'Sentence fragment for impact': 'No warning. Just noise.',
  'Strategic sentence fragment': 'No witness. No mercy.',
  'Controlled repetition': 'She waited, waited, and waited.',
  Alliteration: 'Fluorescent flicker fractured the floor.',
  Onomatopoeia: 'Clang. Snap. Thud.',
  Juxtaposition: 'Outside, the crowd roared; inside, he whispered.',
  Motif: 'Again, the red thread appeared at each turning point.',
  'Embedded clause': 'She, still shaking from the call, unlocked the final gate.',
  'Rhetorical question': 'Who benefits when students are forced to start exhausted?',
  'Direct address': 'You deserve rules that match how real learning works.',
  'Call to action': 'Choose a policy that supports both wellbeing and achievement.',
  'Counterpoint sentence': 'Some argue strict bans work; however, guided use teaches stronger judgment.',
  'Parallel structure': 'We need fair rules, clear teaching, and consistent support.',
  'Direct recommendation': 'School leaders should introduce phased phone-free lessons immediately.',
  'Concession + rebuttal': 'While concerns about distraction are valid, targeted routines solve more than blanket bans.',
  'Triadic structure': 'This policy is practical, measurable, and fair.',
  Antithesis: 'Not louder rules, but smarter support.',
  'Strong modal verbs': 'Schools must prioritise learning conditions that students can sustain.',
  'Qualified concession': 'Although implementation may be uneven at first, the long-term gains justify reform.',
  Anaphora: 'We need clarity, we need consistency, we need courage.',
  'Strategic rhetorical question': 'If evidence shows harm, why delay action?',
  'Because sentence': 'Because the doorway narrows, the character loses control.',
  'Effect sentence': 'This image unsettles the audience and heightens dread.',
  'Technique + effect': 'Through contrast, the writer amplifies the character internal conflict.',
  'Quote sandwich': 'By repeating "still", the line slows pace and signals hesitation.',
  'Analytical verb pattern': 'The scene reveals, reframes, and intensifies the power imbalance.',
  'Embedded quote': 'The warning "too late" frames the choice as irreversible.',
  'Comparative phrase': 'Unlike the opening, this moment presents authority as unstable.',
  'Concluding insight': 'Overall, form and language work together to expose moral uncertainty.',
  'Evaluative qualifier': 'Arguably, this framing invites a skeptical response.',
  'Analytical connective': 'Consequently, the audience reads the silence as strategic rather than passive.',
  'Micro quote integration': 'The verb "fractures" suggests sudden loss of control.',
  'Authorial intent phrase': 'The writer appears to position the audience against passive compliance.',
  'Sophisticated analytical verb': 'The sequence destabilises certainty and complicates alignment.',
  'Synthesis sentence': 'Structure, imagery, and tone converge to construct a fragile authority.',
  'Interpretive hedge': 'Perhaps the hesitation signals moral uncertainty.',
}

const ADJECTIVE_BANKS = {
  middlePrimary: [
    'brave', 'quiet', 'stormy', 'spiky', 'shaky', 'dusty', 'foggy', 'slippery', 'noisy', 'gentle',
    'wild', 'sleepy', 'swift', 'nervous', 'grumpy', 'jumpy', 'muddy', 'messy', 'tidy', 'curious',
    'proud', 'glossy', 'scratchy', 'bumpy', 'creaky', 'soggy', 'smoky', 'fierce', 'calm', 'jagged',
    'restless', 'echoey', 'drizzly', 'clumsy', 'wobbly', 'musty', 'sticky', 'gritty', 'puzzled', 'steady',
  ],
  upperPrimary: [
    'tense', 'restless', 'frantic', 'eerie', 'awkward', 'wary', 'brittle', 'ragged', 'hollow', 'uneasy',
    'defiant', 'gloomy', 'urgent', 'numb', 'jagged', 'stale', 'bitter', 'silent', 'furious', 'dreary',
    'hesitant', 'fragile', 'grim', 'faded', 'shivering', 'isolated', 'cluttered', 'haunting', 'blunt', 'watchful',
    'edgy', 'coiled', 'drained', 'muted', 'flickering', 'strained', 'warped', 'uneven', 'brooding', 'hushed',
  ],
  lowerSecondary: [
    'relentless', 'fractured', 'stifling', 'brooding', 'volatile', 'abrasive', 'suffocating', 'hushed', 'feral', 'disoriented',
    'taut', 'unsteady', 'ragged', 'strained', 'ominous', 'vivid', 'bleak', 'piercing', 'hollow', 'gritty',
    'coiled', 'desolate', 'charged', 'faltering', 'abrupt', 'shadowed', 'raw', 'brittle', 'shuddering', 'stagnant',
    'unnerving', 'frayed', 'haggard', 'sour', 'jarring', 'forbidden', 'ashen', 'gaunt', 'restive', 'threadbare',
  ],
  upperSecondary: [
    'claustrophobic', 'discordant', 'visceral', 'forensic', 'volatile', 'haggard', 'bleak', 'feverish', 'sardonic', 'staccato',
    'luminous', 'peripheral', 'fragmented', 'tenuous', 'acerbic', 'delirious', 'evasive', 'palpable', 'cinematic', 'resonant',
    'transient', 'morose', 'anxious', 'unforgiving', 'abrasive', 'contested', 'haunting', 'submerged', 'corrosive', 'unnerving',
    'precarious', 'oblique', 'incendiary', 'unmoored', 'fractious', 'liminal', 'forbidding', 'labile', 'searing', 'granular',
  ],
}

const ACTIVE_VERB_BANKS = {
  middlePrimary: [
    'ran', 'grabbed', 'pulled', 'pushed', 'jumped', 'shouted', 'rushed', 'climbed', 'slammed', 'snatched',
    'twisted', 'dragged', 'darted', 'kicked', 'sprinted', 'stomped', 'lifted', 'raced', 'slipped', 'dodged',
  ],
  upperPrimary: [
    'lunged', 'yanked', 'braced', 'gripped', 'scrambled', 'stumbled', 'snapped', 'lurched', 'hustled', 'pressed',
    'jerked', 'heaved', 'edged', 'clutched', 'flung', 'hammered', 'skidded', 'thudded', 'shoved', 'spun',
  ],
  lowerSecondary: [
    'surged', 'wrenched', 'pivoted', 'braced', 'lurched', 'slammed', 'snapped', 'drove', 'dragged', 'barreled',
    'scraped', 'lashed', 'thrust', 'stalked', 'hammered', 'crashed', 'veered', 'vaulted', 'forced', 'clawed',
  ],
  upperSecondary: [
    'recalibrated', 'catapulted', 'intercepted', 'leveraged', 'stabilised', 'fractured', 'accelerated', 'orchestrated', 'extracted', 'dislodged',
    'embedded', 'confronted', 'disrupted', 'navigated', 'outpaced', 'reoriented', 'absorbed', 'unravelled', 'countered', 'reframed',
  ],
}

const JOB_EXAMPLES = {
  'Start with tension in sentence 1.': ['Without warning, the latch snapped behind her.', 'Before he could breathe, the gate slammed shut.'],
  'State your opinion in sentence 1.': ['Schools should start later.', 'Phones should stay off in class.'],
  'Answer the question in sentence 1.': ['The text presents power as unstable.', 'The scene reveals growing distrust.'],
  'Include 1 context link: memory/place/history/recent event/childhood/trauma/loss-triumph.': [
    'Memory: It reminded her of the day he left.',
    'Location: At the old station platform, she finally understood.',
    'Historical detail: Since the 1983 flood, the bridge had never felt safe.',
    'Recent event: After last week storm, every crack mattered.',
    'Childhood event: Ever since the bike crash at nine, he avoided steep roads.',
    'Trauma/loss-triumph: Since losing his brother, winning meant something else.',
  ],
  'Include 1 short fragment line.': ['No second chance.', 'Then silence.'],
  'Include 1 metaphor and 1 synecdoche.': ['Metaphor: The street was a clenched fist.', 'Synecdoche: All eyes turned to the gate.'],
  'Include 1 TNT sentence (under 6 words).': ['No way out.', 'Too late.'],
  'Zero was/were.': ['Use clawed not was clawing.', 'Use echoed not was loud.'],
}

const pickAdjectiveSamples = (ageBand) => {
  const pool = [...ADJECTIVE_BANKS[ageBand]]
  const picks = []
  while (picks.length < 12 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length)
    picks.push(pool[index])
    pool.splice(index, 1)
  }
  return picks.join(', ')
}

const pickVerbSamples = (ageBand, count) => {
  const pool = [...ACTIVE_VERB_BANKS[ageBand]]
  const picks = []
  while (picks.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length)
    picks.push(pool[index])
    pool.splice(index, 1)
  }
  return picks.join(', ')
}

const pickTwoDifferent = (items) => {
  if (!items.length) return ['', '']
  if (items.length === 1) return [items[0], items[0]]
  const firstIndex = Math.floor(Math.random() * items.length)
  let secondIndex = Math.floor(Math.random() * items.length)
  while (secondIndex === firstIndex) secondIndex = Math.floor(Math.random() * items.length)
  return [items[firstIndex], items[secondIndex]]
}

const pickExampleForJob = (jobText, ageBand) => {
  if (jobText.toLowerCase().includes('describing words')) return pickAdjectiveSamples(ageBand)
  if (jobText.toLowerCase().includes('4 great active verbs')) return pickVerbSamples(ageBand, 4)
  if (jobText.toLowerCase().includes('3 great active verbs')) return pickVerbSamples(ageBand, 3)
  if (jobText.toLowerCase().includes('active verbs')) return pickVerbSamples(ageBand, 4)
  if (jobText.toLowerCase().includes('zero was/were')) return pickVerbSamples(ageBand, 4)
  if (jobText.toLowerCase().includes('start with a great action sentence')) return pickActionStarterExample(ageBand)

  const bank = JOB_EXAMPLES[jobText]
  if (bank?.length) return randomItem(bank)

  const lower = jobText.toLowerCase()
  if (lower.includes('start')) return pickActionStarterExample(ageBand)
  if (lower.includes('mood')) return 'A bitter wind scraped across the empty street.'
  if (lower.includes('device')) return 'Metaphor: Fear was a drumbeat.'
  if (lower.includes('sentence starter')) return 'Try: From beyond the...'
  if (lower.includes('tnt')) return 'No way out.'
  return 'The gate scraped shut behind him.'
}

const ensureSimpleJobs = ({ jobs, mode, adjectiveTarget, ageBand }) => {
  const forcedStart = getStartCardInstruction(mode)
  const converted = jobs
    .map((job) => conciseInstruction(job, adjectiveTarget, mode, ageBand))
    .filter((text) => !text.toLowerCase().includes('metaphor and 1 synecdoche') && text !== forcedStart)
  const pool = SIMPLE_FALLBACK_JOBS[mode][ageBand]
  const unique = []
  const seen = new Set()

  unique.push(forcedStart)
  seen.add(forcedStart)

  converted.forEach((text) => {
    if (!seen.has(text)) {
      seen.add(text)
      unique.push(text)
    }
  })

  pool.forEach((text) => {
    if (unique.length < 5 && !seen.has(text) && !text.toLowerCase().includes('metaphor and 1 synecdoche')) {
      seen.add(text)
      unique.push(text)
    }
  })

  return unique.slice(0, 5).map((text, index) => ({
    id: `simple-${mode}-${ageBand}-${index + 1}`,
    concise: text,
    conciseExample: pickExampleForJob(text, ageBand),
  }))
}

const buildForcedCards789 = ({ ageBand, devices, sentenceStarts }) => {
  const selectedDevice = devices[0]?.text || 'Metaphor'
  const [firstStart, secondStart] = pickTwoDifferent(
    sentenceStarts.length ? sentenceStarts : ['Without warning,', 'From beyond the gate,'],
  )
  const proPattern = randomItem(BLUE_PROFESSIONAL_SENTENCE_BANK[ageBand] || BLUE_PROFESSIONAL_SENTENCE_BANK.lowerSecondary)

  return [
    {
      id: `forced-7-${selectedDevice}`,
      concise: `Use this device: ${selectedDevice}.`,
      conciseExample: DEVICE_EXAMPLES[selectedDevice] || 'Use it once, clearly.',
    },
    {
      id: `forced-8-${ageBand}`,
      concise: `Include these 2 starts: "${firstStart}" and "${secondStart}"`,
      conciseExample: 'Use each start once.',
    },
    {
      id: `forced-9-${ageBand}`,
      concise: `Use a ${proPattern.name} sentence.`,
      conciseExample: proPattern.sentence,
    },
  ]
}

const buildForcedCards789ForMode = ({ mode, ageBand, devices, sentenceStarts }) => {
  if (mode === 'narrative') {
    const selectedDevice = devices[0]?.text || 'Metaphor'
    const [firstStart, secondStart] = pickTwoDifferent(
      sentenceStarts.length ? sentenceStarts : ['Without warning,', 'From beyond the gate,'],
    )
    const actionPattern = randomItem(ACTION_SENTENCE_PATTERN_BANK[ageBand] || ACTION_SENTENCE_PATTERN_BANK.lowerSecondary)

    return [
      {
        id: `forced-6-action-${ageBand}`,
        concise: `Use a ${actionPattern.name} sentence.`,
        conciseExample: actionPattern.sentence,
      },
      {
        id: `forced-7-starts-${ageBand}`,
        concise: `Include these 2 starts: "${firstStart}" and "${secondStart}"`,
        conciseExample: 'Use each start once.',
      },
      {
        id: `forced-8-device-${selectedDevice}`,
        concise: `Use this device: ${selectedDevice}.`,
        conciseExample: DEVICE_EXAMPLES[selectedDevice] || 'Use it once, clearly.',
      },
    ]
  }
  return buildForcedCards789({ ageBand, devices, sentenceStarts })
}

export const createEmptyHistory = () => ({
  recentTaskIds: [],
  recentJobIds: [],
  recentJobCombos: [],
  recentDeviceIds: [],
  recentSentencePackIds: [],
})

export const remixJobCard = ({ currentOutput, mode, ageBand, banks = DEFAULT_CONTENT_BANKS, cardIndex }) => {
  if (!currentOutput?.jobs?.length) return currentOutput
  const nextJobs = [...currentOutput.jobs]
  const current = nextJobs[cardIndex]
  if (!current) return currentOutput

  const corePool = SIMPLE_FALLBACK_JOBS[mode][ageBand]

  if (cardIndex === 0) {
    const startText = getStartCardInstruction(mode)
    nextJobs[cardIndex] = {
      ...current,
      concise: startText,
      conciseExample: pickExampleForJob(startText, ageBand),
    }
  } else if (cardIndex <= 4) {
    const usedByOthers = new Set(nextJobs.filter((_, idx) => idx !== cardIndex).map((job) => job.concise))
    const choices = corePool.filter(
      (text) =>
        text !== current.concise &&
        !usedByOthers.has(text) &&
        !text.toLowerCase().includes('metaphor and 1 synecdoche'),
    )
    const picked = choices.length ? randomItem(choices) : current.concise
    nextJobs[cardIndex] = {
      ...current,
      concise: picked,
      conciseExample: pickExampleForJob(picked, ageBand),
    }
  } else if (cardIndex === 5) {
    if (mode === 'narrative') {
      const actionPattern = randomItem(ACTION_SENTENCE_PATTERN_BANK[ageBand] || ACTION_SENTENCE_PATTERN_BANK.lowerSecondary)
      nextJobs[cardIndex] = {
        ...current,
        concise: `Use a ${actionPattern.name} sentence.`,
        conciseExample: actionPattern.sentence,
      }
    } else {
      const proPattern = randomItem(BLUE_PROFESSIONAL_SENTENCE_BANK[ageBand] || BLUE_PROFESSIONAL_SENTENCE_BANK.lowerSecondary)
      nextJobs[cardIndex] = {
        ...current,
        concise: `Use a ${proPattern.name} sentence.`,
        conciseExample: proPattern.sentence,
      }
    }
  } else if (cardIndex === 6) {
    const starts = banks.sentenceStarterBanks[mode][ageBand].map((entry) => entry.text)
    const [firstStart, secondStart] = pickTwoDifferent(starts.length ? starts : ['Without warning,', 'From beyond the gate,'])
    nextJobs[cardIndex] = {
      ...current,
      concise: `Include these 2 starts: "${firstStart}" and "${secondStart}"`,
      conciseExample: 'Use each start once.',
    }
  } else if (cardIndex === 7) {
    const deviceBank = banks.deviceBanks[mode][ageBand].map((entry) => entry.text)
    const selectedDevice = randomItem(deviceBank) || 'Metaphor'
    nextJobs[cardIndex] = {
      ...current,
      concise: `Use this device: ${selectedDevice}.`,
      conciseExample: DEVICE_EXAMPLES[selectedDevice] || 'Use it once, clearly.',
    }
  }

  return { ...currentOutput, jobs: nextJobs }
}

export const generatePrompt = ({ mode, ageBand, autoTask, customTask, variationMode, history, banks = DEFAULT_CONTENT_BANKS }) => {
  const task = pickTask({ mode, ageBand, autoTask, customTask, recentTaskIds: history.recentTaskIds, banks })
  const { jobs } = pickJobsWithHistory({
    mode,
    ageBand,
    variationMode,
    recentJobIds: history.recentJobIds,
    recentJobCombos: history.recentJobCombos,
    banks,
  })

  const sentenceContent = pickSentenceContent({ mode, ageBand, recentSentencePackIds: history.recentSentencePackIds, banks })
  const devices = pickDevices({ mode, ageBand, recentDeviceIds: history.recentDeviceIds, banks })
  const ageMeta = AGE_BANDS.find((band) => band.id === ageBand)

  const simpleCoreJobs = ensureSimpleJobs({ jobs, mode, adjectiveTarget: ageMeta.adjectives, ageBand })
  const forcedCards = buildForcedCards789ForMode({
    mode,
    ageBand,
    devices,
    sentenceStarts: sentenceContent.sentenceStarts,
  })
  const simpleJobs = [...simpleCoreJobs, ...forcedCards]
  const simpleJobComboSignature = simpleJobs.map((job) => job.id).join('|')

  const nextHistory = {
    recentTaskIds: trimHistory([...history.recentTaskIds, task.id]),
    recentJobIds: trimHistory([...history.recentJobIds, ...simpleJobs.map((job) => job.id)]),
    recentJobCombos: trimHistory([...history.recentJobCombos, simpleJobComboSignature]),
    recentDeviceIds: trimHistory([...history.recentDeviceIds, ...devices.map((device) => device.id)]),
    recentSentencePackIds: trimHistory([...history.recentSentencePackIds, ...sentenceContent.sentenceIds]),
  }

  return {
    result: {
      task: task.text,
      isCustomTask: task.custom ?? false,
      wordTarget: ageMeta.words,
      adjectiveTarget: ageMeta.adjectives,
      jobs: simpleJobs,
      sentenceStarts: sentenceContent.sentenceStarts,
      sentenceMoves: sentenceContent.sentenceMoves,
      professionalSentences: sentenceContent.professionalSentences,
      devices: devices.map((device) => device.text),
      avoidStarts: banks.bannedStarts,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    history: nextHistory,
  }
}
