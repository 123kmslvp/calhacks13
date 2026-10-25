import { dayKey } from './roster.js'

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
  { icon: '📚', label: 'Finish a story', points: 50 },
  { icon: '⏱️', label: 'Read for 10 minutes', points: 20 },
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
