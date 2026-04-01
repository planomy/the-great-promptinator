export const WRITING_MODES = [
  { id: 'narrative', label: 'Narrative' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'analytical', label: 'Analytical' },
]

export const AGE_BANDS = [
  { id: 'middlePrimary', label: 'Middle Primary', words: 'About 50 words', adjectives: '5-6 adjectives' },
  { id: 'upperPrimary', label: 'Upper Primary', words: 'About 70-75 words', adjectives: '7-9 adjectives' },
  { id: 'lowerSecondary', label: 'Lower Secondary', words: 'About 100 words', adjectives: '10-12 adjectives' },
  { id: 'upperSecondary', label: 'Upper Secondary', words: 'About 140 words', adjectives: '14-17 adjectives' },
]

export const BANNED_STARTS = [
  'The', 'It', 'A', 'An', 'He', 'She', 'His', 'Her', 'This', 'These', 'They', 'Then', 'There', 'I', 'My', 'We', 'Suddenly',
]

const makeEntries = (prefix, items) =>
  items.map((text, index) => ({ id: `${prefix}-${index + 1}`, text }))

export const PROMPT_BANKS = {
  narrative: {
    middlePrimary: makeEntries('n-mp', ['The Gate', 'The Gift', 'The Box', 'Lost', 'The Visitor', 'The Door']),
    upperPrimary: makeEntries('n-up', ['The Phone Call', 'The Locked Shed', 'Late to the Bus', 'The Key', 'After the Storm', 'The Shortcut']),
    lowerSecondary: makeEntries('n-ls', ['The Message', 'The Last Train', 'One Wrong Turn', 'The Empty Stadium', 'The Red Folder', 'Under the Bridge']),
    upperSecondary: makeEntries('n-us', ['The Threshold', 'The Return', 'No Signal', 'Unsent', 'The Quiet Street', 'Second Attempt']),
  },
  persuasive: {
    middlePrimary: makeEntries('p-mp', ['Should homework be shorter on weekdays?', 'Should every class have daily reading time?', 'Should schools have more outdoor lessons?']),
    upperPrimary: makeEntries('p-up', ['Should mobile phones be allowed during breaks?', 'Should schools start later?', 'Should sport be compulsory every week?']),
    lowerSecondary: makeEntries('p-ls', ['Should public transport be free for students?', 'Should AI tools be limited in classrooms?', 'Should exams be replaced with portfolios?']),
    upperSecondary: makeEntries('p-us', ['Should governments regulate persuasive algorithms on social media?', 'Should news literacy be a graduation requirement?']),
  },
  analytical: {
    middlePrimary: makeEntries('a-mp', ['How does the main character show courage?', 'How does the setting create mood?', 'How does one choice affect the story?']),
    upperPrimary: makeEntries('a-up', ['How does the writer build tension?', 'How does dialogue reveal motivation?', 'How does the ending shape the message?']),
    lowerSecondary: makeEntries('a-ls', ['How does the text represent power in this scene?', 'How does structure intensify conflict?', 'How does symbolism deepen theme?']),
    upperSecondary: makeEntries('a-us', ['How does the text construct moral ambiguity?', 'How does form shape audience response to the turning point?']),
  },
}

export const SENTENCE_STARTER_BANKS = {
  narrative: {
    middlePrimary: makeEntries('ss-n-mp', ['Beyond the gate,', 'Without warning,', 'At first light,', 'From the corner,', 'Before anyone noticed,']),
    upperPrimary: makeEntries('ss-n-up', ['Even though the street was quiet,', 'By the time I reached the fence,', 'Just as the wind changed,', 'From somewhere behind me,', 'As the lock clicked,']),
    lowerSecondary: makeEntries('ss-n-ls', ['Minutes earlier,', 'Against better judgment,', 'As the silence thickened,', 'Without looking back,', 'Under a wavering streetlight,']),
    upperSecondary: makeEntries('ss-n-us', ['At the precise moment the street emptied,', 'Long before the truth surfaced,', 'With the door still half-open,', 'When the corridor finally stilled,']),
  },
  persuasive: {
    middlePrimary: makeEntries('ss-p-mp', ['I strongly believe', 'One clear reason is', 'Another important reason is', 'For example,', 'Most importantly,']),
    upperPrimary: makeEntries('ss-p-up', ['Schools should', 'A practical reason is', 'It is clear that', 'Some people may think', 'For students today,']),
    lowerSecondary: makeEntries('ss-p-ls', ['The strongest position is that', 'Firstly, this policy would', 'However, evidence suggests', 'Ultimately, schools should']),
    upperSecondary: makeEntries('ss-p-us', ['A defensible position is that', 'At policy level,', 'While opponents contend that', 'Therefore, decision-makers should']),
  },
  analytical: {
    middlePrimary: makeEntries('ss-a-mp', ['In this scene,', 'The character shows', 'The writer helps us see', 'This moment suggests', 'One clear example is']),
    upperPrimary: makeEntries('ss-a-up', ['The writer shows this by', 'The scene suggests that', 'This detail highlights', 'The audience understands that', 'Overall, this moment reveals']),
    lowerSecondary: makeEntries('ss-a-ls', ['The text positions the audience to', 'This is evident when', 'The writer constructs', 'As a result, the audience']),
    upperSecondary: makeEntries('ss-a-us', ['The text establishes this idea through', 'Crucially, the writer/director', 'As a consequence, the audience is positioned to']),
  },
}

export const DEVICE_BANKS = {
  narrative: {
    middlePrimary: makeEntries('d-n-mp', ['Short sentence for impact', 'Alliteration', 'Onomatopoeia', 'Rule of three']),
    upperPrimary: makeEntries('d-n-up', ['Metaphor', 'Sensory pair', 'Em dash detail', 'Rule of three']),
    lowerSecondary: makeEntries('d-n-ls', ['Symbolic detail', 'Extended metaphor', 'Controlled repetition', 'Em dash insert']),
    upperSecondary: makeEntries('d-n-us', ['Motif', 'Juxtaposition', 'Strategic sentence fragment', 'Embedded clause']),
  },
  persuasive: {
    middlePrimary: makeEntries('d-p-mp', ['Rhetorical question', 'Rule of three', 'Direct address', 'Call to action']),
    upperPrimary: makeEntries('d-p-up', ['Counterpoint sentence', 'Rhetorical question', 'Parallel structure', 'Direct recommendation']),
    lowerSecondary: makeEntries('d-p-ls', ['Concession + rebuttal', 'Triadic structure', 'Antithesis', 'Strong modal verbs']),
    upperSecondary: makeEntries('d-p-us', ['Qualified concession', 'Anaphora', 'Antithesis', 'Strategic rhetorical question']),
  },
  analytical: {
    middlePrimary: makeEntries('d-a-mp', ['Because sentence', 'Effect sentence', 'Technique + effect', 'Quote sandwich']),
    upperPrimary: makeEntries('d-a-up', ['Analytical verb pattern', 'Embedded quote', 'Comparative phrase', 'Concluding insight']),
    lowerSecondary: makeEntries('d-a-ls', ['Embedded clause', 'Analytical connective', 'Micro quote integration', 'Authorial intent phrase']),
    upperSecondary: makeEntries('d-a-us', ['Evaluative qualifier', 'Sophisticated analytical verb', 'Synthesis sentence', 'Interpretive hedge']),
  },
}

export const MODEL_SENTENCE_MOVES = {
  narrative: {
    middlePrimary: makeEntries('sm-n-mp', ['Open with a place clue before the action.', 'Use one short impact sentence after a longer sentence.']),
    upperPrimary: makeEntries('sm-n-up', ['Use a fronted phrase to set atmosphere.', 'Pair one sensory detail with one action verb.']),
    lowerSecondary: makeEntries('sm-n-ls', ['Pivot from calm to tension in one sentence.', 'Use an em dash to add a revealing detail.']),
    upperSecondary: makeEntries('sm-n-us', ['Layer external action with internal response.', 'Control pacing by alternating long and short clauses.']),
  },
  persuasive: {
    middlePrimary: makeEntries('sm-p-mp', ['State your opinion in sentence one.', 'Use a reason sentence that starts with Because.']),
    upperPrimary: makeEntries('sm-p-up', ['Open with a direct claim.', 'Use one sentence that gives a real example.']),
    lowerSecondary: makeEntries('sm-p-ls', ['Use a concession before your rebuttal.', 'Frame one reason with practical impact.']),
    upperSecondary: makeEntries('sm-p-us', ['Establish position with a qualified claim.', 'Integrate one counterargument and rebut it.']),
  },
  analytical: {
    middlePrimary: makeEntries('sm-a-mp', ['Answer the question first.', 'Add one specific detail from the text.']),
    upperPrimary: makeEntries('sm-a-up', ['Use This suggests after your evidence.', 'Name one technique and explain its effect.']),
    lowerSecondary: makeEntries('sm-a-ls', ['Use an analytical verb in your topic sentence.', 'Integrate short evidence within your own sentence.']),
    upperSecondary: makeEntries('sm-a-us', ['Lead with a precise thesis response.', 'Synthesize technique, evidence, and interpretation.']),
  },
}

export const PROFESSIONAL_SENTENCE_BANK = {
  narrative: {
    upperPrimary: makeEntries('ps-n-up', ['A thin line of light slipped under the door as the room held its breath.']),
    lowerSecondary: makeEntries('ps-n-ls', ['He stepped forward, but the silence met him first.']),
    upperSecondary: makeEntries('ps-n-us', ['By the time the key turned, the decision had already been made in the space between one breath and the next.']),
  },
  persuasive: {
    upperPrimary: makeEntries('ps-p-up', ['If we want fair outcomes, our school rules must match how students actually learn.']),
    lowerSecondary: makeEntries('ps-p-ls', ['A policy is only effective when it is practical, equitable, and consistently applied.']),
    upperSecondary: makeEntries('ps-p-us', ['Any serious reform must balance accountability with the conditions that make sustained achievement possible.']),
  },
  analytical: {
    upperPrimary: makeEntries('ps-a-up', ['This detail matters because it shifts how the audience interprets the character intent.']),
    lowerSecondary: makeEntries('ps-a-ls', ['Through controlled contrast, the text positions the audience to question whose perspective is privileged.']),
    upperSecondary: makeEntries('ps-a-us', ['Rather than offering a simple moral, the text cultivates ambiguity to expose the instability of certainty itself.']),
  },
}

const job = (id, title, description, example, weight, core = false) => ({
  id,
  title,
  description,
  example,
  weight,
  core,
})

export const JOB_TEMPLATE_BANKS = {
  narrative: {
    middlePrimary: [
      job('nmp-open', 'Open with interest', 'Start with a place, sound, or action straight away.', 'Example: Beyond the gate, wheels screeched.', 9, true),
      job('nmp-past', 'Use past tense', 'Keep verbs in past tense for control.', null, 10, true),
      job('nmp-adj', 'Add describing words', 'Use your adjective target in natural places.', null, 8, true),
      job('nmp-imagery', 'Show what can be seen', 'Include one clear sight image.', null, 7),
      job('nmp-active', 'Choose strong verbs', 'Pick active verbs over weak verbs + adverbs.', null, 7),
      job('nmp-end', 'End clearly', 'Finish with a line that closes the moment.', null, 6),
    ],
    upperPrimary: [
      job('nup-open', 'Open with tension', 'Start in a moment that feels uncertain or urgent.', null, 9, true),
      job('nup-past', 'Control past tense', 'Stay consistent with past tense verbs.', null, 9, true),
      job('nup-adj', 'Use precise descriptors', 'Aim for your adjective target with purpose.', null, 8, true),
      job('nup-imagery', 'Build sensory mood', 'Use sight or sound to shape atmosphere.', null, 8),
      job('nup-verb', 'Strengthen verbs', 'Replace weak verb + adverb combinations.', null, 7),
      job('nup-device', 'Use one craft move', 'Apply one listed device for effect.', null, 7),
    ],
    lowerSecondary: [
      job('nls-open', 'Begin in motion', 'Start inside the turning point, not before it.', null, 9, true),
      job('nls-mood', 'Establish mood early', 'Signal mood within the first two sentences.', null, 8, true),
      job('nls-adj', 'Control description', 'Hit adjective target without overloading.', null, 8),
      job('nls-verb', 'Prioritise active verbs', 'Use precise active verbs to drive events.', null, 8, true),
      job('nls-imagery', 'Layer sensory detail', 'Include sight and sound detail.', null, 7),
      job('nls-device', 'Embed a literary device', 'Use one listed device deliberately.', null, 7),
    ],
    upperSecondary: [
      job('nus-open', 'Craft a purposeful opening', 'Start with controlled tension or contrast.', null, 9, true),
      job('nus-control', 'Control voice and tense', 'Maintain past tense and consistent stance.', null, 8, true),
      job('nus-adj', 'Use precision modifiers', 'Meet adjective target through selective detail.', null, 7),
      job('nus-syntax', 'Manipulate syntax', 'Use sentence length shifts to control pacing.', null, 8, true),
      job('nus-device', 'Use a sophisticated device', 'Apply motif, juxtaposition, or repetition.', null, 8),
      job('nus-imagery', 'Sustain tonal imagery', 'Carry one visual thread through the piece.', null, 7),
    ],
  },
  persuasive: {
    middlePrimary: [
      job('pmp-opinion', 'State your opinion early', 'Give your position in the opening sentence.', null, 10, true),
      job('pmp-reasons', 'Give two reasons', 'Use at least two clear reasons.', null, 9, true),
      job('pmp-example', 'Add one example', 'Include one practical or real-life example.', null, 8, true),
      job('pmp-device', 'Use one persuasive move', 'Try one device from the list.', null, 7),
      job('pmp-ending', 'End strongly', 'Finish by restating what should happen.', null, 8),
    ],
    upperPrimary: [
      job('pup-opinion', 'Lead with a clear claim', 'Present your opinion in the first line.', null, 10, true),
      job('pup-reasons', 'Develop two reasons', 'Each reason should be distinct and clear.', null, 9, true),
      job('pup-example', 'Use specific evidence', 'Back one reason with a concrete example.', null, 8, true),
      job('pup-counter', 'Acknowledge another view', 'Include a brief counterpoint before rebuttal.', null, 7),
      job('pup-device', 'Apply one persuasive device', 'Use one rhetorical strategy for emphasis.', null, 7),
    ],
    lowerSecondary: [
      job('pls-claim', 'Establish your contention', 'State a precise position immediately.', null, 10, true),
      job('pls-reasons', 'Build a two-reason structure', 'Use at least two developed reasons.', null, 9, true),
      job('pls-evidence', 'Integrate one strong example', 'Use evidence or realistic case detail.', null, 8, true),
      job('pls-counter', 'Use concession and rebuttal', 'Address a counterargument and answer it.', null, 8),
      job('pls-technique', 'Feature a persuasive technique', 'Use one listed rhetorical technique.', null, 7),
    ],
    upperSecondary: [
      job('pus-thesis', 'Present a nuanced thesis', 'State a defensible and specific position early.', null, 10, true),
      job('pus-reasons', 'Develop layered reasoning', 'Use two or more reasons with depth.', null, 9, true),
      job('pus-evidence', 'Use credible examples', 'Anchor argument in realistic evidence.', null, 8, true),
      job('pus-counter', 'Integrate counterargument', 'Concede and rebut with precision.', null, 8),
      job('pus-rhetoric', 'Employ strategic rhetoric', 'Use one high-level persuasive device.', null, 7),
    ],
  },
  analytical: {
    middlePrimary: [
      job('amp-answer', 'Answer the question first', 'State your answer in sentence one.', null, 10, true),
      job('amp-present', 'Use present tense', 'Write mostly in present tense for analysis.', null, 9, true),
      job('amp-detail', 'Use one specific detail', 'Refer to a clear moment from the text/scene.', null, 8, true),
      job('amp-verb', 'Use an analytical verb', 'Choose words like shows, reveals, suggests.', null, 7),
      job('amp-effect', 'Explain audience effect', 'Say how the detail affects reader/viewer.', null, 8),
    ],
    upperPrimary: [
      job('aup-answer', 'Respond directly', 'Answer the question clearly in your opening.', null, 10, true),
      job('aup-present', 'Maintain present tense', 'Keep analysis in present tense.', null, 9, true),
      job('aup-evidence', 'Use specific evidence', 'Refer to a clear quote, action, or shot.', null, 8, true),
      job('aup-verb', 'Use analytical verbs', 'Use reveals, emphasises, contrasts, positions.', null, 8),
      job('aup-effect', 'Explain effect', 'State reader/viewer impact of the technique.', null, 8),
    ],
    lowerSecondary: [
      job('als-thesis', 'Answer with a thesis', 'Open with a direct, arguable response.', null, 10, true),
      job('als-present', 'Use present tense control', 'Maintain present tense analytical voice.', null, 9, true),
      job('als-evidence', 'Integrate textual detail', 'Embed specific evidence in your sentence.', null, 8),
      job('als-verb', 'Use analytical verbs', 'Employ at least two precise analytical verbs.', null, 8),
      job('als-effect', 'Explain audience impact', 'Explain what the audience is led to think/feel.', null, 8),
    ],
    upperSecondary: [
      job('aus-thesis', 'State a precise thesis', 'Open with a clear, nuanced response.', null, 10, true),
      job('aus-present', 'Sustain present tense analysis', 'Keep analytical tense and register stable.', null, 9, true),
      job('aus-evidence', 'Integrate specific references', 'Use concise textual or cinematic evidence.', null, 8),
      job('aus-verb', 'Use sophisticated analytical verbs', 'Use 2+ high-precision verbs.', null, 8),
      job('aus-effect', 'Analyse audience effect deeply', 'Explain not only effect, but significance.', null, 8),
    ],
  },
}

export const DEFAULT_CONTENT_BANKS = {
  promptBanks: PROMPT_BANKS,
  sentenceStarterBanks: SENTENCE_STARTER_BANKS,
  deviceBanks: DEVICE_BANKS,
  jobTemplateBanks: JOB_TEMPLATE_BANKS,
  modelSentenceMoves: MODEL_SENTENCE_MOVES,
  professionalSentenceBank: PROFESSIONAL_SENTENCE_BANK,
  bannedStarts: BANNED_STARTS,
}
