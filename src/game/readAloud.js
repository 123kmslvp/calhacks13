// Pure logic for the read-aloud checker: splitting a passage into words,
// following along with a speech transcript, and scoring the reading.

export const normalizeWord = (word) =>
  word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z']/g, '')
    .replace(/'/g, '')

// Splits a passage into paragraphs of display words, each with a global
// index, the sentence it belongs to, and a normalized form for matching.
export function tokenizePassage(text) {
  let index = 0
  let sentence = 0
  const paragraphs = text.split(/\n\s*\n/).map((para) =>
    para
      .split(/\s+/)
      .filter(Boolean)
      .map((display) => {
        const word = { display, norm: normalizeWord(display), index: index++, sentence }
        if (/[.!?]["”’)]*$/.test(display)) sentence++
        return word
      })
  )
  const words = paragraphs.flat()
  const sentences = []
  for (const w of words) (sentences[w.sentence] ??= []).push(w)
  return { paragraphs, words, sentences }
}

export const MAX_TRICKY_WORDS = 6

// Words to rescue after reading: ones the reader asked for help with first,
// then ones they skipped. Skipped short words ("the", "was") are left out —
// those are usually the recognizer missing them, not the reader struggling.
// Each entry keeps the first place the word appears, for its sentence.
export function trickyWords(words, matched, helped) {
  const picked = new Map()
  const add = (w, reason) => {
    const minLength = reason === 'help' ? 2 : 4
    if (w.norm.length < minLength || picked.has(w.norm)) return
    picked.set(w.norm, { word: w.norm, display: w.display.replace(/[^A-Za-z'’-]/g, ''), index: w.index, sentence: w.sentence, reason })
  }
  for (const i of helped) add(words[i], 'help')
  for (const w of words) if (!matched.has(w.index)) add(w, 'missed')
  return [...picked.values()].slice(0, MAX_TRICKY_WORDS)
}

// Small edit distance, so "poppys" still matches "Poppy's" and kids aren't
// penalized when the recognizer mishears one letter.
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return dp[a.length][b.length]
}

// `strict` is for a single word said on its own (Word Rescue), where there's
// no surrounding passage to confirm a near-miss — "orange" isn't "strange".
export function wordsMatch(spoken, expected, { strict = false } = {}) {
  if (!spoken || !expected) return false
  if (spoken === expected) return true
  if (expected.length <= 3) return false
  if (strict) return expected.length >= 5 && editDistance(spoken, expected) <= 1
  return editDistance(spoken, expected) <= (expected.length >= 7 ? 2 : 1)
}

const LOOK_AHEAD = 6
const RESYNC_RANGE = 40
const RESYNC_RUN = 3

// Follows the reader through the passage. For each spoken word, looks a few
// words ahead of the current spot for a match, so skipped words are missed
// but the reader doesn't lose their place. If the reader skipped further
// (a whole sentence or line), it re-syncs by finding a run of spoken words
// that match the passage further ahead. Returns the set of matched word
// indexes and the index of the next word to read.
export function alignTranscript(words, transcript) {
  const spoken = transcript.split(/\s+/).map(normalizeWord).filter(Boolean)
  const matched = new Set()
  let position = 0

  // Words with nothing to say (e.g. a lone dash) count as read automatically.
  const skipBlank = () => {
    while (position < words.length && words[position].norm === '') {
      matched.add(position)
      position++
    }
  }

  const runMatches = (start, k) => {
    for (let r = 0; r < RESYNC_RUN; r++) {
      if (!words[start + r] || !spoken[k + r]) return false
      if (!wordsMatch(spoken[k + r], words[start + r].norm)) return false
    }
    return true
  }

  spoken.forEach((said, k) => {
    skipBlank()
    const near = Math.min(words.length, position + LOOK_AHEAD)
    for (let i = position; i < near; i++) {
      if (wordsMatch(said, words[i].norm)) {
        matched.add(i)
        position = i + 1
        return
      }
    }
    const far = Math.min(words.length, position + RESYNC_RANGE)
    for (let i = near; i < far; i++) {
      if (runMatches(i, k)) {
        matched.add(i)
        position = i + 1
        return
      }
    }
  })
  skipBlank()
  return { matched, position }
}

export function starsFor(completion) {
  if (completion >= 0.9) return 3
  if (completion >= 0.7) return 2
  if (completion >= 0.4) return 1
  return 0
}

export function scoreReading(words, matched, seconds) {
  const total = words.length
  const read = matched.size
  const completion = total ? read / total : 0
  const stars = starsFor(completion)
  const minutes = seconds / 60
  return {
    total,
    read,
    completion,
    stars,
    seconds,
    // Words read correctly per minute — shown to teachers, never to students.
    wcpm: minutes > 0 ? Math.round(read / minutes) : 0,
  }
}
