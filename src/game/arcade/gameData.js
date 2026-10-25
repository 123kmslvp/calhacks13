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

// ---------- Pathway games ----------
// Each helper below turns any story chapter into rounds for one of the games
// that match the four learning pathways.

const wordCount = (s) => s.split(/\s+/).filter(Boolean).length
const clipWords = (s, n) => {
  const w = s.split(/\s+/)
  return w.length <= n ? s : `${w.slice(0, n).join(' ')}…`
}

// Paragraphs of a chapter, each with its picture (chapter.art) and its first
// real sentence. Chapters with no art fall back to the chapter scene.
export function scenes(chapter) {
  const { paragraphs } = tokenizePassage(chapter.text)
  return paragraphs.map((words, i) => {
    const sentences = []
    let current = []
    for (const w of words) {
      current.push(w)
      if (/[.!?]["”’)]*$/.test(w.display)) {
        sentences.push(current)
        current = []
      }
    }
    if (current.length) sentences.push(current)
    const texts = sentences.map(sentenceText)
    return {
      i,
      art: chapter.art?.[i] ?? chapter.scene ?? '📖',
      text: words.map((w) => w.display).join(' '),
      lead: texts.find((t) => wordCount(t) >= 5) ?? texts[0] ?? '',
    }
  })
}

// Picture Match: hear a sentence, pick the scene that shows it.
export function pictureRounds(story, chapter) {
  const mine = scenes(chapter)
  const others = story.chapters.filter((c) => c !== chapter).flatMap(scenes)
  return mine.slice(0, 3).map((s) => {
    const wrong = shuffle([...mine.filter((m) => m.i !== s.i), ...others].filter((m) => m.art !== s.art)).slice(0, 2)
    return { sentence: s.lead, answer: s.art, choices: shuffle([s.art, ...wrong.map((w) => w.art)]) }
  })
}

// Story Map: pictured parts of the chapter to place in order.
const MAP_LABELS = { 2: ['Beginning', 'End'], 3: ['Beginning', 'Middle', 'End'], 4: ['First', 'Next', 'Then', 'Last'] }
export function mapRound(chapter) {
  const parts = scenes(chapter).slice(0, 4)
  return {
    labels: MAP_LABELS[parts.length] ?? parts.map((_, i) => `Part ${i + 1}`),
    parts: parts.map((p) => ({ i: p.i, art: p.art, text: clipWords(p.lead, 14), full: p.lead })),
  }
}

// Echo Reader: short sentences to hear, then say back.
export function echoRounds(chapter) {
  const { sentences } = tokenizePassage(chapter.text)
  const usable = sentences
    .map((s, i) => ({ i, words: s, text: sentenceText(s) }))
    .filter((s) => wordCount(s.text) >= 4 && wordCount(s.text) <= 12)
  const count = Math.min(3, usable.length)
  return Array.from({ length: count }, (_, k) => usable[Math.round((k * (usable.length - 1)) / Math.max(1, count - 1))])
}

// Sound Detective: hear a meaning, tap the word it describes.
export function listenRounds(story) {
  const words = vocabRound(story)
  return shuffle(words).slice(0, 4).map((w) => ({
    ...w,
    choices: shuffle([w, ...shuffle(words.filter((x) => x.word !== w.word)).slice(0, 2)]).map((x) => x.word),
  }))
}

// Sentence Builder: scrambled words of a short sentence.
export function buildRounds(chapter) {
  const { sentences } = tokenizePassage(chapter.text)
  const usable = sentences.map(sentenceText).filter((t) => wordCount(t) >= 4 && wordCount(t) <= 9)
  return shuffle(usable).slice(0, 3).map((text) => {
    const words = text.split(/\s+/).map((display, i) => ({ display, i }))
    let cards = shuffle(words)
    while (words.length > 1 && cards.every((c, i) => c.i === i)) cards = shuffle(words)
    return { text, words, cards }
  })
}

// Word Workshop: use a story word in your own sentence.
export const workshopRounds = (story) => shuffle(vocabRound(story)).slice(0, 3)

// Predict & Peek: read a part, guess what comes next, then peek.
export function predictRounds(chapter) {
  const parts = scenes(chapter)
  const rounds = []
  for (let k = 0; k + 1 < parts.length && rounds.length < 2; k++) {
    rounds.push({ now: parts[k], next: parts[k + 1], pics: parts.map((p) => p.art) })
  }
  return rounds
}

// True or Tricky?: a statement from a question that is either right or
// subtly wrong, with the proof sentence to reveal afterward.
export function trickyRounds(chapter) {
  const { sentences } = tokenizePassage(chapter.text)
  const texts = sentences.map(sentenceText)
  const norm = (t) => t.split(/\s+/).map(normalizeWord).filter(Boolean).join(' ')
  const usable = chapter.questions.filter((q) => !q.open && q.choices?.length > 1 && q.evidence)
  return shuffle(usable).slice(0, 4).map((q, n) => {
    const tricky = n % 2 === 1
    const wrong = shuffle(q.choices.filter((_, i) => i !== q.answer))[0]
    const proof = texts.find((t) => norm(t).includes(norm(q.evidence))) ?? q.evidence
    return { question: q.prompt, shown: tricky ? wrong : q.choices[q.answer], tricky, truth: q.choices[q.answer], proof, hint: q.hint }
  })
}
