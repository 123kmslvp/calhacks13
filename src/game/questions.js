import { normalizeWord } from './readAloud.js'

// Comprehension question logic: scoring, checking open answers, and the
// follow-up questions that help students explain their reasoning.

export const QUESTION_TYPES = {
  mainIdea: { icon: '💡', kid: 'Big idea' },
  details: { icon: '🔎', kid: 'Important details' },
  vocabulary: { icon: '📘', kid: 'Word meaning' },
  inference: { icon: '🧠', kid: 'Reading between the lines' },
  prediction: { icon: '🔮', kid: 'Make a prediction' },
  factOpinion: { icon: '⚖️', kid: 'Fact or opinion?' },
  evidence: { icon: '🔍', kid: 'Explain with evidence' },
}

// Multiple choice: full credit first try, real credit for trying again.
export const choiceScore = (correct, tries) => (correct ? (tries === 1 ? 100 : 60) : 20)

const words = (text) => text.split(/\s+/).map(normalizeWord).filter(Boolean)

// A spoken or typed word matches a keyword if it's the same word or a form
// of it ("rang" ≠ "ring", but "bells" ~ "bell", "repeating" ~ "repeat").
const sameIdea = (word, keyword) =>
  word === keyword || (keyword.length >= 4 && word.length >= 4 && (word.startsWith(keyword) || keyword.startsWith(word)))

const normText = (t) => words(t).join(' ')

// Looks at an open answer: which key ideas it mentions, whether it uses
// evidence (a sentence they picked, or words quoted from the story), and
// how much they wrote.
export function evaluateOpen(question, text, evidenceSentence, passageSentences = []) {
  const said = words(text)
  const ideas = question.keywords.map((group) => group.some((k) => said.some((w) => sameIdea(w, k))))
  const ideasHit = ideas.filter(Boolean).length

  const goodEvidence = question.evidence.map(normText)
  const picked = evidenceSentence ? normText(evidenceSentence) : ''
  const pickedRelevant = !!picked && goodEvidence.some((e) => picked.includes(e) || e.includes(picked))
  // Quoting five or more words in a row from a supporting sentence counts too.
  const answer = said.join(' ')
  const quoted = goodEvidence.some((e) => {
    const ew = e.split(' ')
    for (let i = 0; i + 5 <= ew.length; i++) if (answer.includes(ew.slice(i, i + 5).join(' '))) return true
    return ew.length < 5 && answer.includes(e)
  })
  const anyQuote = passageSentences.some((s) => {
    const ew = normText(s).split(' ')
    for (let i = 0; i + 5 <= ew.length; i++) if (answer.includes(ew.slice(i, i + 5).join(' '))) return true
    return false
  })

  return {
    wordCount: said.length,
    ideasHit,
    ideasTotal: ideas.length,
    hasEvidence: pickedRelevant || quoted,
    pickedEvidence: !!picked,
    pickedRelevant,
    quotedSomething: quoted || anyQuote,
  }
}

export function openQuality(evaluation) {
  const { wordCount, ideasHit, ideasTotal, hasEvidence } = evaluation
  if (wordCount >= 5 && ideasHit >= Math.min(ideasTotal, 2) && hasEvidence) return 'strong'
  if (wordCount >= 4 && ideasHit >= 1) return 'partial'
  return 'short'
}

export const openScore = (quality, answeredFollowUp) =>
  ({ strong: 100, partial: answeredFollowUp ? 75 : 60, short: answeredFollowUp ? 55 : 30 })[quality]

// Chooses one follow-up question to stretch the student's thinking, based
// on what their answer is missing. Returns null when the answer is already
// strong.
//
// This is the place to plug in Claude later: send the question, the
// passage, and the student's answer to a backend endpoint that asks Claude
// for one short, encouraging follow-up question, and fall back to these
// rules if it's unavailable. (Never call the API directly from the browser —
// the key would be exposed.)
export function followUpFor(question, evaluation) {
  const quality = openQuality(evaluation)
  if (quality === 'strong') return null
  if (evaluation.wordCount < 4) {
    return {
      kind: 'more',
      prompt: 'Tell me more. Why do you think that?',
    }
  }
  if (!evaluation.hasEvidence) {
    return {
      kind: 'evidence',
      prompt: evaluation.pickedEvidence
        ? 'How does that sentence help?'
        : 'Good idea! Tap a sentence that proves it.',
    }
  }
  return {
    kind: 'why',
    prompt: 'Good proof! Why does it fit?',
  }
}

// Praise that names what the student did well — specific, not generic.
export function praiseFor(evaluation, quality) {
  if (quality === 'strong') return 'Great! You used proof from the story.'
  if (evaluation.hasEvidence) return 'Nice! You found proof.'
  if (evaluation.ideasHit > 0) return 'Good idea! Next time, add proof.'
  return 'Thanks for sharing!'
}

// The sentence (from the passage's tokenized sentences) that contains an
// evidence string.
export function findSentence(sentences, evidence) {
  if (!evidence) return -1
  const target = normText(evidence)
  return sentences.findIndex((s) => normText(s.map((w) => w.display).join(' ')).includes(target))
}
