// Checks every story file against the story format.
// Usage: node scripts/validate-stories.mjs
import { readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { WORLDS, DIFFICULTIES } from '../src/data/stories/worlds.js'
import { tokenizePassage, normalizeWord } from '../src/game/readAloud.js'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/stories')
const files = readdirSync(dir).filter((f) => f.endsWith('.js') && !['index.js', 'worlds.js'].includes(f))
const TYPES = ['mainIdea', 'details', 'vocabulary', 'prediction', 'inference', 'factOpinion', 'evidence']
const norm = (t) => t.split(/\s+/).map(normalizeWord).filter(Boolean).join(' ')

let problems = 0
const ids = new Set()
const fail = (file, msg) => {
  problems++
  console.log(`✗ ${file}: ${msg}`)
}

for (const file of files) {
  const story = (await import(pathToFileURL(path.join(dir, file)))).default
  const where = (s) => `${file} ${s}`
  if (!story) { fail(file, 'no default export'); continue }
  for (const key of ['id', 'world', 'title', 'genre', 'grade', 'difficulty', 'minutes', 'cover', 'summary', 'writingPrompt', 'chapters']) {
    if (story[key] === undefined) fail(file, `missing "${key}"`)
  }
  if (!WORLDS.some((w) => w.id === story.world)) fail(file, `unknown world "${story.world}"`)
  if (!DIFFICULTIES.includes(story.difficulty)) fail(file, `difficulty must be one of ${DIFFICULTIES}`)
  if (![3, 4, 5].includes(story.grade)) fail(file, 'grade must be 3, 4, or 5')
  if (ids.has(story.id)) fail(file, `duplicate story id ${story.id}`)
  ids.add(story.id)

  const typesSeen = new Set()
  for (const ch of story.chapters ?? []) {
    const at = where(ch.id)
    if (ids.has(ch.id)) fail(at, 'duplicate chapter id')
    ids.add(ch.id)
    for (const key of ['id', 'title', 'scene', 'art', 'text', 'vocab', 'drawIdeas', 'questions']) {
      if (ch[key] === undefined) fail(at, `missing "${key}"`)
    }
    if (/\d/.test(ch.text)) fail(at, 'text has numerals — spell numbers out')
    if (/\w-\w/.test(ch.text)) fail(at, 'text has hyphenated words — rewrite without hyphens')
    const { paragraphs, words, sentences } = tokenizePassage(ch.text)
    if (ch.art?.length !== paragraphs.length) fail(at, `art has ${ch.art?.length} pictures but text has ${paragraphs.length} paragraphs`)
    const min = { 3: 70, 4: 90, 5: 110 }[story.grade]
    const max = { 3: 130, 4: 160, 5: 190 }[story.grade]
    if (words.length < min || words.length > max) fail(at, `${words.length} words (grade ${story.grade} should be ${min}–${max})`)
    const textWords = new Set(words.map((w) => w.norm))
    for (const v of ch.vocab ?? []) {
      if (!textWords.has(normalizeWord(v.word))) fail(at, `vocab word "${v.word}" isn't in the text`)
      if (!v.definition || !v.example) fail(at, `vocab "${v.word}" needs definition and example`)
    }
    const sentenceTexts = sentences.map((s) => norm(s.map((w) => w.display).join(' ')))
    const inOneSentence = (e) => sentenceTexts.some((s) => s.includes(norm(e)))
    const qs = ch.questions ?? []
    if (qs.length !== 4) fail(at, `has ${qs.length} questions (needs 4: three choice + one open)`)
    if (qs.filter((q) => q.open).length !== 1) fail(at, 'needs exactly one open "evidence" question')
    for (const q of qs) {
      const qa = `${at} ${q.id}`
      if (ids.has(q.id)) fail(qa, 'duplicate question id')
      ids.add(q.id)
      if (!TYPES.includes(q.type)) fail(qa, `unknown type "${q.type}"`)
      typesSeen.add(q.type)
      if (!q.prompt) fail(qa, 'missing prompt')
      if (q.open) {
        if (q.type !== 'evidence') fail(qa, 'open questions must have type "evidence"')
        if (!Array.isArray(q.keywords) || q.keywords.length < 1) fail(qa, 'open question needs keyword groups')
        if (!q.evidence?.length) fail(qa, 'open question needs evidence sentences')
        for (const e of q.evidence ?? []) if (!inOneSentence(e)) fail(qa, `evidence not found in one sentence: "${e}"`)
        if (!q.sample) fail(qa, 'open question needs a sample answer')
      } else {
        if (!Array.isArray(q.choices) || q.choices.length < 2) fail(qa, 'needs choices')
        if (!(q.answer >= 0 && q.answer < q.choices.length)) fail(qa, 'answer index out of range')
        if (!q.hint) fail(qa, 'needs a hint')
        if (q.type === 'factOpinion') {
          if (!q.explain) fail(qa, 'fact/opinion needs an "explain"')
        } else if (!q.evidence || !inOneSentence(q.evidence)) {
          fail(qa, `evidence not found in one sentence: "${q.evidence}"`)
        }
      }
    }
  }
  const missingTypes = TYPES.filter((t) => !typesSeen.has(t) && !['details', 'prediction', 'factOpinion'].includes(t))
  if (missingTypes.length) fail(file, `story should include question types: ${missingTypes.join(', ')}`)
  console.log(`${problems ? '…' : '✓'} ${file}: "${story.title}" (${story.chapters?.length} chapters)`)
}

console.log(problems ? `\n${problems} problem(s) found.` : `\nAll ${files.length} stories look good.`)
process.exit(problems ? 1 : 0)
