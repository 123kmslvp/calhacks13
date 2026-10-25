// Splits a word into syllables for "say it in parts" help, e.g.
// "pattern" → ["pat", "tern"]. Uses common phonics rules with a small
// exceptions list for words the rules get wrong. Good enough for helping a
// reader sound out a word — not a dictionary.

const EXCEPTIONS = {
  something: ['some', 'thing'],
  someone: ['some', 'one'],
  every: ['ev', 'ery'],
  pieces: ['piec', 'es'],
  started: ['start', 'ed'],
  listened: ['lis', 'tened'],
  cheered: ['cheered'],
  climbed: ['climbed'],
  tried: ['tried'],
  sequence: ['se', 'quence'],
  debugging: ['de', 'bug', 'ging'],
  closely: ['close', 'ly'],
  morning: ['morn', 'ing'],
  needed: ['need', 'ed'],
  across: ['a', 'cross'],
  fixing: ['fix', 'ing'],
  keeper: ['keep', 'er'],
  tower: ['tow', 'er'],
}

const DIGRAPHS = ['ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'gh', 'qu']
const isVowel = (word, i) => {
  const ch = word[i]
  if ('aeiou'.includes(ch)) return true
  // y is a vowel unless it starts the word or follows a vowel ("day")
  return ch === 'y' && i > 0 && !'aeiou'.includes(word[i - 1])
}

export function syllables(display) {
  const word = display.toLowerCase().replace(/[^a-z]/g, '')
  if (EXCEPTIONS[word]) return EXCEPTIONS[word]
  if (word.length <= 3) return [word]

  // Find vowel groups (syllable centers).
  const groups = []
  for (let i = 0; i < word.length; i++) {
    if (isVowel(word, i) && !(word[i] === 'u' && word[i - 1] === 'q')) {
      const start = i
      while (i + 1 < word.length && isVowel(word, i + 1)) i++
      groups.push({ start, end: i })
    }
  }

  // Silent endings: final "e" (but not consonant + "le"), and "ed"/"es"
  // unless they make their own sound ("wanted", "boxes").
  const last = groups[groups.length - 1]
  if (groups.length > 1 && last) {
    const tail = word.slice(last.start)
    const before = word[last.start - 1]
    const silentE = tail === 'e' && !(word.endsWith('le') && !isVowel(word, word.length - 3))
    const silentEd = tail === 'ed' && !'td'.includes(before)
    const silentEs = tail === 'es' && !'sxz'.includes(before) && !/(ch|sh)es$/.test(word)
    if (silentE || silentEd || silentEs) groups.pop()
  }
  if (groups.length <= 1) return [word]

  // Split between vowel groups.
  const cuts = []
  for (let g = 0; g < groups.length - 1; g++) {
    const from = groups[g].end + 1
    const to = groups[g + 1].start // exclusive
    const consonants = word.slice(from, to)
    let cut
    if (consonants.length === 0) cut = from // vowel-vowel: "po-em"
    else if (consonants.length === 1) cut = from // V-CV: "ti-ny"
    else if (DIGRAPHS.includes(consonants.slice(0, 2)) && consonants.length > 2) cut = from + 2 // "king-dom"
    else if (DIGRAPHS.includes(consonants.slice(-2)) && consonants.length === 2) cut = from // "ga-ther"
    else cut = from + 1 // VC-CV: "pat-tern"
    // consonant + "le" stays together: "lit-tle"
    if (g === groups.length - 2 && word.endsWith('le') && to === word.length - 1) cut = to - 2
    cuts.push(cut)
  }

  const parts = []
  let prev = 0
  for (const cut of cuts) {
    parts.push(word.slice(prev, cut))
    prev = cut
  }
  parts.push(word.slice(prev))
  return parts.filter(Boolean)
}
