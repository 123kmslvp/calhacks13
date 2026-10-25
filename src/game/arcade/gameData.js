import { normalizeWord, tokenizePassage } from '../readAloud.js'

// Builds rounds for the arcade games from any story, so every new story
// automatically works in every game.

export const shuffle = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const sentenceText = (s) => s.map((w) => w.display).join(' ')

// Story Sequencer: four sentences spread across a chapter, in story order.
export function sequenceRound(chapter) {
  const { sentences } = tokenizePassage(chapter.text)
  const usable = sentences.map((s, i) => ({ i, text: sentenceText(s) })).filter((s) => s.text.split(' ').length >= 5)
  const count = Math.min(4, usable.length)
  const picks = Array.from({ length: count }, (_, k) => usable[Math.round((k * (usable.length - 1)) / Math.max(1, count - 1))])
  return [...new Map(picks.map((p) => [p.i, p])).values()] // in order
}

// Vocab Pop: every vocab word in the story with its meaning.
export const vocabRound = (story) => story.chapters.flatMap((c) => c.vocab).slice(0, 6)

// Evidence Detective: claims (question + right answer) that have a proof sentence.
export function evidenceRounds(chapter) {
  const { sentences } = tokenizePassage(chapter.text)
  const texts = sentences.map(sentenceText)
  const norm = (t) => t.split(/\s+/).map(normalizeWord).filter(Boolean).join(' ')
  return chapter.questions
    .filter((q) => !q.open && q.evidence)
    .map((q) => ({
      claim: `${q.prompt} → “${q.choices[q.answer]}”`,
      answer: texts.findIndex((t) => norm(t).includes(norm(q.evidence))),
      hint: q.hint,
    }))
    .filter((r) => r.answer >= 0)
}

// Missing Word: sentences with one vocab word blanked out.
export function clozeRounds(story) {
  const vocab = story.chapters.flatMap((c) => c.vocab.map((v) => v.word))
  const rounds = []
  for (const chapter of story.chapters) {
    const { sentences } = tokenizePassage(chapter.text)
    for (const v of chapter.vocab) {
      const target = normalizeWord(v.word)
      const s = sentences.find((sent) => sent.some((w) => w.norm === target))
      if (!s) continue
      const others = shuffle(vocab.filter((w) => normalizeWord(w) !== target)).slice(0, 2)
      rounds.push({
        before: sentenceText(s.slice(0, s.findIndex((w) => w.norm === target))),
        after: sentenceText(s.slice(s.findIndex((w) => w.norm === target) + 1)),
        punctuation: s.find((w) => w.norm === target).display.replace(/^[A-Za-z']+/, ''),
        answer: v.word,
        choices: shuffle([v.word, ...others]),
        sentence: sentenceText(s),
      })
    }
  }
  return shuffle(rounds).slice(0, 5)
}
