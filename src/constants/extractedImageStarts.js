const uniqueByText = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    const key = item.text.trim().toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const toEntries = (prefix, starts) =>
  starts.map((text, index) => ({ id: `${prefix}-${index + 1}`, text }))

const EXTRACTED = {
  sentenceStarterBanks: {
    narrative: {
      upperPrimary: toEntries('img-n-up', [
        'From beyond the',
        'Without turning,',
        'When the moment passed,',
        'After ten minutes or so,',
        'In the meantime,',
        'Later she realised',
        'Without hesitating',
      ]),
      lowerSecondary: toEntries('img-n-ls', [
        'Wiping it away with',
        'Since that moment',
        'Ashamed, he turned and',
        'With a whisper, she',
        'Breathing heavily,',
        'With quivering hands,',
      ]),
      upperSecondary: toEntries('img-n-us', [
        'Though they were from',
        'Thinking of the injustice, she',
        'Triggered by',
        'Sooner than anticipated',
        'Before entering the',
      ]),
    },
  },
  modelSentenceMoves: {
    narrative: {
      lowerSecondary: toEntries('img-sm-n-ls', [
        'Quadruple Verb: use four dynamic verbs in one high-energy sentence.',
        'Em-Dash Descriptor: interrupt with an em-dash detail for voice.',
      ]),
    },
  },
}

export const mergeExtractedImageBanks = (baseBanks) => {
  const clone = JSON.parse(JSON.stringify(baseBanks))

  const mergeSection = (sectionKey) => {
    const sourceSection = EXTRACTED[sectionKey]
    if (!sourceSection) return
    Object.entries(sourceSection).forEach(([mode, ageMap]) => {
      Object.entries(ageMap).forEach(([ageBand, newEntries]) => {
        const existing = clone[sectionKey][mode][ageBand] ?? []
        clone[sectionKey][mode][ageBand] = uniqueByText([...existing, ...newEntries])
      })
    })
  }

  mergeSection('sentenceStarterBanks')
  mergeSection('modelSentenceMoves')
  return clone
}
