import { dayKey } from './roster.js'
import { STORIES } from './stories.js'
import { POINTS } from '../game/readAloud.js'

// ---------- Poppy's growth ----------
// Pop Points are Poppy's energy. Every story, answer, and new word warms
// Poppy up until — POP! — Poppy grows into the next stage. Points are never
// spent or lost, so a student's Poppy only ever grows. Each stage unlocks
// something new to dress Poppy up with.

export const POPPY_STAGES = [
  { id: 'kernel', name: 'Tiny Kernel', min: 0, about: 'Poppy is a tiny kernel, ready to warm up!' },
  { id: 'warm', name: 'Warm Kernel', min: 100, about: 'Poppy is getting warm and toasty!', item: { id: 'bow', icon: '🎀', label: 'Bow' } },
  { id: 'sizzle', name: 'Sizzling Kernel', min: 250, about: 'Poppy is sizzling — almost ready to pop!', item: { id: 'glasses', icon: '🕶️', label: 'Cool shades' } },
  { id: 'pop', name: 'Little Pop', min: 450, about: 'POP! Poppy popped into popcorn!', item: { id: 'cap', icon: '🧢', label: 'Ball cap' } },
  { id: 'big', name: 'Big Pop', min: 700, about: 'Poppy is big, fluffy, and proud of you!', item: { id: 'scarf', icon: '🧣', label: 'Cozy scarf' } },
  { id: 'super', name: 'Super Poppy', min: 1000, about: 'Super Poppy! The best popcorn in the whole kingdom!', item: { id: 'crown', icon: '👑', label: 'Crown' } },
]

export const POPPY_ITEMS = POPPY_STAGES.filter((s) => s.item).map((s) => ({ ...s.item, min: s.min }))

export const POINT_RULES = [
  { icon: '📚', label: 'Finish a whole story', points: POINTS.storyComplete },
  { icon: '🎤', label: 'Read a chapter aloud', points: POINTS.finishReading },
  { icon: '⭐', label: 'Each new star on a chapter', points: POINTS.perStar },
  { icon: '⏱️', label: 'Read for 10 minutes in a day', points: POINTS.tenMinutes },
  { icon: '🛟', label: 'Rescue a tricky word', points: POINTS.rescue },
  { icon: '🎨', label: 'Draw your favorite scene', points: POINTS.drawing },
  { icon: '🔍', label: 'Use evidence in an answer', points: 15 },
  { icon: '💬', label: 'Answer a question', points: 10 },
  { icon: '🔤', label: 'Practice a new word', points: 5 },
]

export function poppyGrowth(points) {
  const index = POPPY_STAGES.findLastIndex((s) => points >= s.min)
  const stage = POPPY_STAGES[index]
  const next = POPPY_STAGES[index + 1] ?? null
  const progress = next ? (points - stage.min) / (next.min - stage.min) : 1
  return { index, stage, next, progress, toNext: next ? next.min - points : 0 }
}

export const isItemUnlocked = (itemId, points) =>
  POPPY_ITEMS.some((i) => i.id === itemId && points >= i.min)

// ---------- Reading stats ----------

export function readingTime(reading) {
  const today = dayKey()
  const weekAgo = dayKey(new Date(Date.now() - 6 * 86400000))
  let minutesToday = 0
  let minutesWeek = 0
  let minutesTotal = 0
  for (const { date, minutes } of reading.log) {
    minutesTotal += minutes
    if (date === today) minutesToday += minutes
    if (date >= weekAgo) minutesWeek += minutes
  }
  return { minutesToday, minutesWeek, minutesTotal }
}

// Friendly words instead of scores, so a lower number never feels like failing.
export function comprehensionLevel(score) {
  if (score === null) return { label: 'Not started yet', stars: 0 }
  if (score < 40) return { label: 'Growing', stars: 1 }
  if (score < 75) return { label: 'Getting stronger', stars: 2 }
  return { label: 'Super strong', stars: 3 }
}

// ---------- Encouraging messages ----------

const WIN_MESSAGES = {
  evidence: 'You explained your answer using evidence!',
  accuracy: 'You improved your reading accuracy!',
  story: 'You finished a whole story!',
  words: 'You learned some brand-new words!',
  streak: 'You read 3 days in a row! Keep it going!',
  rescue: 'You rescued tricky words by saying them out loud!',
}

export function encouragements(student) {
  const { minutesToday, minutesWeek } = readingTime(student.reading)
  const messages = []

  if (minutesToday > 0) {
    messages.push(`You practiced reading for ${minutesToday} minutes today!`)
  } else if (minutesWeek > 0) {
    messages.push(`You read for ${minutesWeek} minutes this week!`)
  }

  const weekAgo = dayKey(new Date(Date.now() - 6 * 86400000))
  const recent = student.reading.wins
    .filter((w) => w.date >= weekAgo)
    .sort((a, b) => b.date.localeCompare(a.date))
  for (const win of recent) {
    const message = WIN_MESSAGES[win.type]
    if (message && !messages.includes(message)) messages.push(message)
    if (messages.length >= 3) break
  }

  const { next, toNext } = poppyGrowth(student.points)
  if (next) messages.push(`Only ${toNext} more Pop Points until Poppy becomes a ${next.name}!`)

  if (messages.length === 1 && student.reading.storiesCompleted === 0) {
    messages.unshift('Every great reader starts somewhere. Your first story is waiting!')
  }
  return messages
}

// ---------- Applying game results ----------

const addPoints = (earned, label, points) => points > 0 && earned.push({ label, points })

// Records a read-aloud attempt. Stars only add points when they beat the
// chapter's best, so re-reading is always worth it but can't be farmed.
// Returns the updated student, the points earned (with reasons), and the
// new Poppy stage if Poppy grew.
export function applyReadAloud(student, { chapter, score, matchedWords, tricky = [] }) {
  const reading = {
    ...student.reading,
    trickyWords: recordTricky(student.reading.trickyWords ?? [], tricky),
    chapterStars: { ...(student.reading.chapterStars ?? {}) },
    log: [...student.reading.log],
    words: [...student.reading.words],
    wins: [...student.reading.wins],
    comprehension: { ...student.reading.comprehension },
  }
  const today = dayKey()
  const earned = []

  addPoints(earned, 'Read the chapter aloud', POINTS.finishReading)

  const bestBefore = reading.chapterStars[chapter.id] ?? 0
  if (score.stars > bestBefore) {
    reading.chapterStars[chapter.id] = score.stars
    addPoints(earned, `${score.stars - bestBefore} new ${score.stars - bestBefore === 1 ? 'star' : 'stars'}`, (score.stars - bestBefore) * POINTS.perStar)
  }

  // Reading time
  const minutesBefore = readingTime(reading).minutesToday
  const minutes = Math.max(1, Math.round(score.seconds / 60))
  const todayEntry = reading.log.find((e) => e.date === today)
  if (todayEntry) {
    reading.log = reading.log.map((e) => (e === todayEntry ? { ...e, minutes: e.minutes + minutes } : e))
  } else {
    reading.log.push({ date: today, minutes })
  }
  if (minutesBefore < 10 && minutesBefore + minutes >= 10) {
    addPoints(earned, 'Read 10 minutes today', POINTS.tenMinutes)
  }

  // Story finished: every chapter has at least one star
  const story = STORIES.find((st) => st.chapters.some((c) => c.id === chapter.id))
  const allStarred = (stars) => story.chapters.every((c) => (stars?.[c.id] ?? 0) > 0)
  if (allStarred(reading.chapterStars) && !allStarred(student.reading.chapterStars)) {
    reading.storiesCompleted += 1
    reading.wins.push({ type: 'story', date: today })
    addPoints(earned, `Finished "${story.title}"`, POINTS.storyComplete)
  }

  // Vocabulary words practiced in this chapter
  let newWords = 0
  for (const word of chapter.vocab) {
    const said = matchedWords.has(word)
    const existing = reading.words.find((w) => w.word === word)
    if (!existing) {
      reading.words.push({ word, mastered: said && score.stars >= 2 })
      newWords++
    } else if (said && score.stars >= 2 && !existing.mastered) {
      reading.words = reading.words.map((w) => (w === existing ? { ...w, mastered: true } : w))
    }
  }
  if (newWords) reading.wins.push({ type: 'words', date: today })

  // Reading accuracy moves gradually so one tough day doesn't erase progress
  const before = reading.comprehension.accuracy
  const attempt = Math.round(score.completion * 100)
  const after = before === null ? attempt : Math.round(before * 0.7 + attempt * 0.3)
  reading.comprehension.accuracy = after
  if (before !== null && after > before) reading.wins.push({ type: 'accuracy', date: today })

  return finish(student, { ...student, reading, lastActive: new Date().toISOString() }, earned)
}

// Tricky words a student is working on: how often they needed help or
// skipped it, and when they last rescued it.
function recordTricky(list, tricky) {
  const today = dayKey()
  const next = [...list]
  for (const t of tricky) {
    const i = next.findIndex((w) => w.word === t.word)
    const entry = i === -1 ? { word: t.word, display: t.display, helps: 0, misses: 0, rescuedOn: null } : { ...next[i] }
    if (t.reason === 'help') entry.helps += 1
    else entry.misses += 1
    entry.lastSeen = today
    if (i === -1) next.push(entry)
    else next[i] = entry
  }
  return next
}

// Points for each tricky word rescued — once per word per day, so the same
// word can't be farmed, but practicing it again tomorrow still counts.
export function applyWordRescue(student, { rescued }) {
  const today = dayKey()
  const list = student.reading.trickyWords ?? []
  const fresh = rescued.filter((word) => list.find((w) => w.word === word)?.rescuedOn !== today)
  const trickyWords = list.map((w) => (rescued.includes(w.word) ? { ...w, rescuedOn: today, rescues: (w.rescues ?? 0) + 1 } : w))
  const wins = fresh.length ? [...student.reading.wins, { type: 'rescue', date: today }] : student.reading.wins
  const earned = fresh.length
    ? [{ label: `Rescued ${fresh.length} tricky ${fresh.length === 1 ? 'word' : 'words'}`, points: fresh.length * POINTS.rescue }]
    : []
  return finish(student, { ...student, reading: { ...student.reading, trickyWords, wins } }, earned)
}

export function applyDrawing(student) {
  const earned = [{ label: 'Drew a favorite scene', points: POINTS.drawing }]
  return finish(student, student, earned)
}

function finish(before, updated, earned) {
  const total = earned.reduce((sum, e) => sum + e.points, 0)
  const after = { ...updated, points: before.points + total }
  const grewFrom = poppyGrowth(before.points).index
  const grown = poppyGrowth(after.points)
  return { student: after, earned, total, grewTo: grown.index > grewFrom ? grown.stage : null }
}
