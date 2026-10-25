import { SKILLS, blend, dayKey } from './roster.js'
import { WORLDS } from './stories/worlds.js'
import { emptyCounters, newBadges } from './badges.js'

// Pop Points for each kind of effort. Most points come from trying —
// reading, answering, trying again, explaining — not from being perfect.
export const POINTS = {
  readChapter: 10,
  readAloud: 10, // bonus for being brave and reading out loud
  almostEveryWord: 10, // read 90%+ of the words aloud
  answer: 5, // every question answered
  tryAgain: 5, // got it after trying again — persistence counts
  evidence: 10, // explained an answer using evidence from the story
  followUp: 5, // answered a "tell me more" question
  rescue: 5, // per tricky word rescued (once per word per day)
  newStar: 10,
  tenMinutes: 20,
  storyComplete: 50,
  drawing: 10,
  writing: 15,
}

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

// Dress-up choices. The robe isn't tied to a growth stage, so it unlocks on its
// own between Big Pop and Super Poppy. (Its emoji is only a fallback; Poppy
// wears the drawn robe.)
export const POPPY_ITEMS = [
  ...POPPY_STAGES.filter((s) => s.item).map((s) => ({ ...s.item, min: s.min })),
  { id: 'robe', icon: '🧥', label: 'Royal robe', min: 850 },
].sort((a, b) => a.min - b.min)

export const POINT_RULES = [
  { icon: '📖', label: 'Read a chapter (any way you like)', points: POINTS.readChapter },
  { icon: '🎤', label: 'Read it out loud', points: POINTS.readAloud },
  { icon: '💬', label: 'Answer a question', points: POINTS.answer },
  { icon: '💪', label: 'Try again after a tricky question', points: POINTS.tryAgain },
  { icon: '🔍', label: 'Explain your answer with evidence', points: POINTS.evidence },
  { icon: '🛟', label: 'Rescue a tricky word', points: POINTS.rescue },
  { icon: '⭐', label: 'Each new star on a chapter', points: POINTS.newStar },
  { icon: '⏱️', label: 'Read for 10 minutes in a day', points: POINTS.tenMinutes },
  { icon: '📚', label: 'Finish a whole story', points: POINTS.storyComplete },
  { icon: '✍️', label: 'Finish a writing activity', points: POINTS.writing },
  { icon: '🎨', label: 'Draw your favorite scene', points: POINTS.drawing },
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
  for (const { date, minutes } of reading.log ?? []) {
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
  tryAgain: "You didn't give up — you tried again and figured it out!",
  thinker: 'You told me more about your thinking. That’s what great readers do!',
  writing: 'You wrote your own story ideas!',
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
  const recent = (student.reading.wins ?? [])
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

const today = () => dayKey()
const add = (earned, label, points) => points > 0 && earned.push({ label, points })

// Chapter stars are earned by effort: ★ read it (any way), ★ answered the
// questions, ★ explained your thinking with evidence.
export function chapterStars(session) {
  const answered = session.answers.length > 0 && session.answers.length >= (session.questionCount ?? 0)
  const explained = session.answers.some((a) => a.open && (a.quality === 'strong' || a.followUpAnswer))
  return 1 + (answered ? 1 : 0) + (explained ? 1 : 0)
}

// Preview of points for Word Rescue (once per word per day).
export function rescuePoints(student, rescued) {
  const list = student.reading.trickyWords ?? []
  return rescued.filter((word) => list.find((w) => w.word === word)?.rescuedOn !== today()).length * POINTS.rescue
}

// Saves one whole chapter session: reading (in any mode), Word Rescue, and
// the comprehension questions. Returns the updated student and everything
// to celebrate: points with reasons, stars, badges, Poppy's growth, and any
// story world that just unlocked.
export function applyChapterSession(student, session) {
  const { story, chapter, mode, seconds, aloud, tricky = [], rescued = [], answers } = session
  const now = new Date().toISOString()
  const day = today()
  const earned = []
  const reading = {
    ...student.reading,
    chapterStars: { ...student.reading.chapterStars },
    log: [...(student.reading.log ?? [])],
    words: [...(student.reading.words ?? [])],
    wins: [...(student.reading.wins ?? [])],
    trickyWords: [...(student.reading.trickyWords ?? [])],
  }
  const counters = { ...emptyCounters(), ...student.counters, modes: { ...emptyCounters().modes, ...student.counters?.modes } }
  const skills = { ...student.skills }

  // Reading
  add(earned, mode === 'listen' ? 'Listened to the chapter' : 'Read the chapter', POINTS.readChapter)
  counters.modes[mode] = (counters.modes[mode] ?? 0) + 1
  if (aloud) {
    counters.readAloud++
    add(earned, 'Read it out loud', POINTS.readAloud)
    if (aloud.completion >= 0.9) add(earned, 'Read almost every word', POINTS.almostEveryWord)
    const before = reading.accuracy
    reading.accuracy = blend(before, Math.round(aloud.completion * 100))
    if (before !== null && before !== undefined && reading.accuracy > before) {
      counters.accuracyUps++
      reading.wins.push({ type: 'accuracy', date: day })
    }
  }

  // Reading time (reading + questions)
  const minutes = Math.max(1, Math.round((seconds + (session.questionSeconds ?? 0)) / 60))
  const minutesBefore = readingTime(reading).minutesToday
  const entry = reading.log.find((e) => e.date === day)
  reading.log = entry
    ? reading.log.map((e) => (e === entry ? { ...e, minutes: e.minutes + minutes } : e))
    : [...reading.log, { date: day, minutes }]
  if (minutesBefore < 10 && minutesBefore + minutes >= 10) add(earned, 'Read 10 minutes today', POINTS.tenMinutes)

  // Vocabulary words met in this chapter
  let newWords = 0
  for (const { word } of chapter.vocab) {
    const mastered = !aloud || aloud.matchedWords.has(word)
    const existing = reading.words.find((w) => w.word === word)
    if (!existing) {
      reading.words.push({ word, mastered })
      newWords++
    } else if (mastered && !existing.mastered) {
      reading.words = reading.words.map((w) => (w === existing ? { ...w, mastered: true } : w))
    }
  }
  if (newWords) reading.wins.push({ type: 'words', date: day })

  // Tricky words: record the struggle, then the rescue
  for (const t of tricky) {
    const i = reading.trickyWords.findIndex((w) => w.word === t.word)
    const e = i === -1 ? { word: t.word, display: t.display, helps: 0, misses: 0, rescuedOn: null, rescues: 0 } : { ...reading.trickyWords[i] }
    if (t.reason === 'help') e.helps++
    else e.misses++
    e.lastSeen = day
    e.sentenceText = t.sentenceText ?? e.sentenceText ?? ''
    if (i === -1) reading.trickyWords.push(e)
    else reading.trickyWords[i] = e
  }
  const rescueEarned = rescuePoints({ reading }, rescued)
  reading.trickyWords = reading.trickyWords.map((w) =>
    rescued.includes(w.word) ? { ...w, rescuedOn: day, rescues: (w.rescues ?? 0) + 1 } : w
  )
  if (rescued.length) {
    counters.rescued += rescued.length
    reading.wins.push({ type: 'rescue', date: day })
    add(earned, `Rescued ${rescued.length} tricky ${rescued.length === 1 ? 'word' : 'words'}`, rescueEarned)
  }

  // Comprehension questions
  const byType = {}
  let retries = 0
  for (const a of answers) {
    byType[a.type] = byType[a.type] === undefined ? a.score : Math.round((byType[a.type] + a.score) / 2)
    skills[a.type] = blend(skills[a.type], a.score)
    if (a.tries > 1 && a.score >= 60) retries++ // tried again and got it
  }
  if (answers.length) add(earned, `Answered ${answers.length} ${answers.length === 1 ? 'question' : 'questions'}`, answers.length * POINTS.answer)
  if (retries) {
    counters.retries += retries
    reading.wins.push({ type: 'tryAgain', date: day })
    add(earned, `Tried again and figured it out ×${retries}`, retries * POINTS.tryAgain)
  }
  const open = answers.filter((a) => a.open)
  const explained = open.filter((a) => a.quality === 'strong').length
  if (explained) {
    counters.evidence += explained
    reading.wins.push({ type: 'evidence', date: day })
    add(earned, 'Explained with evidence', explained * POINTS.evidence)
  }
  const followUps = open.filter((a) => a.followUpAnswer).length
  if (followUps) {
    counters.followUps += followUps
    reading.wins.push({ type: 'thinker', date: day })
    add(earned, 'Told me more about your thinking', followUps * POINTS.followUp)
  }
  const responses = [
    ...open.map((a) => ({
      date: now,
      storyTitle: story.title,
      chapterTitle: chapter.title,
      question: a.prompt,
      answer: a.text,
      mode: a.mode,
      evidence: a.evidence ?? null,
      followUp: a.followUp ?? null,
      followUpAnswer: a.followUpAnswer ?? null,
      quality: a.quality,
    })),
    ...(student.responses ?? []),
  ].slice(0, 40)

  // Stars (only new stars add points, so replaying is for learning, not farming)
  const stars = chapterStars(session)
  const starsBefore = reading.chapterStars[chapter.id] ?? 0
  if (stars > starsBefore) {
    reading.chapterStars[chapter.id] = stars
    add(earned, `${stars - starsBefore} new ${stars - starsBefore === 1 ? 'star' : 'stars'}`, (stars - starsBefore) * POINTS.newStar)
  }

  // Story finished: every chapter has at least one star
  const allDone = (st) => story.chapters.every((c) => (st?.[c.id] ?? 0) > 0)
  const storyJustFinished = allDone(reading.chapterStars) && !allDone(student.reading.chapterStars)
  if (storyJustFinished) {
    reading.storiesCompleted += 1
    reading.wins.push({ type: 'story', date: day })
    add(earned, `Finished "${story.title}"`, POINTS.storyComplete)
  }

  const quizScore = answers.length ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length) : null
  const history = [
    ...(student.history ?? []),
    {
      date: now,
      storyId: story.id,
      storyTitle: story.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      mode,
      seconds,
      ...(aloud && { accuracy: Math.round(aloud.completion * 100), wcpm: aloud.wcpm }),
      quiz: quizScore === null ? null : { score: quizScore, byType },
    },
  ]

  const updated = {
    ...student,
    skills,
    reading,
    counters,
    responses,
    history,
    sessions: (student.sessions ?? 0) + 1,
    lastActive: now,
  }
  return {
    ...finish(student, updated, earned),
    stars,
    starsBefore,
    storyJustFinished,
  }
}

// Practicing saved tricky words outside of a chapter.
export function applyWordPractice(student, { rescued }) {
  const day = today()
  const points = rescuePoints(student, rescued)
  const counters = { ...emptyCounters(), ...student.counters }
  counters.rescued += rescued.length
  const reading = {
    ...student.reading,
    trickyWords: student.reading.trickyWords.map((w) =>
      rescued.includes(w.word) ? { ...w, rescuedOn: day, rescues: (w.rescues ?? 0) + 1 } : w
    ),
    wins: rescued.length ? [...(student.reading.wins ?? []), { type: 'rescue', date: day }] : student.reading.wins,
  }
  return finish(student, { ...student, counters, reading }, [
    { label: `Rescued ${rescued.length} tricky ${rescued.length === 1 ? 'word' : 'words'}`, points },
  ])
}

// Arcade games: points for playing and for each answer found (first try or not).
export function applyGame(student, { game, correct, total }) {
  const counters = { ...emptyCounters(), ...student.counters, games: (student.counters?.games ?? 0) + 1 }
  const minutes = 2
  const day = today()
  const log = [...(student.reading.log ?? [])]
  const entry = log.find((e) => e.date === day)
  const reading = {
    ...student.reading,
    log: entry ? log.map((e) => (e === entry ? { ...e, minutes: e.minutes + minutes } : e)) : [...log, { date: day, minutes }],
  }
  return finish(student, { ...student, counters, reading }, [
    { label: `Played ${game}`, points: 10 },
    { label: `${correct} of ${total} answers`, points: correct * 5 },
  ])
}

export function applyDrawing(student) {
  const counters = { ...emptyCounters(), ...student.counters }
  counters.drawings++
  return finish(student, { ...student, counters }, [{ label: 'Drew a favorite scene', points: POINTS.drawing }])
}

export function applyWriting(student, { story, prompt, text, mode }) {
  const counters = { ...emptyCounters(), ...student.counters }
  counters.writings++
  const writings = [{ id: `${Date.now()}`, date: new Date().toISOString(), storyTitle: story.title, prompt, text, mode }, ...(student.writings ?? [])].slice(0, 20)
  const reading = { ...student.reading, wins: [...(student.reading.wins ?? []), { type: 'writing', date: today() }] }
  return finish(student, { ...student, counters, writings, reading }, [{ label: 'Wrote your own story ideas', points: POINTS.writing }])
}

// Adds points, then works out what to celebrate: Poppy growing, new badges,
// and newly unlocked story worlds.
function finish(before, updated, earned) {
  const list = earned.filter((e) => e.points > 0)
  const total = list.reduce((sum, e) => sum + e.points, 0)
  const after = { ...updated, points: before.points + total }
  const badges = newBadges(after)
  after.badges = [...(after.badges ?? []), ...badges.map((b) => ({ id: b.id, date: new Date().toISOString() }))]
  const grewFrom = poppyGrowth(before.points).index
  const grown = poppyGrowth(after.points)
  const unlockedWorlds = WORLDS.filter((w) => w.unlockAt && before.points < w.unlockAt && after.points >= w.unlockAt)
  return {
    student: after,
    earned: list,
    total,
    grewTo: grown.index > grewFrom ? grown.stage : null,
    badges,
    unlockedWorlds,
  }
}

// Kid-friendly reading pace feedback (never a number for the student).
export function paceMessage(wcpm, grade) {
  const target = { 3: 90, 4: 110, 5: 125 }[grade] ?? 100
  if (wcpm < target * 0.6) return { icon: '🐢', text: 'Nice and careful!' }
  if (wcpm > target * 1.5) return { icon: '🐇', text: 'Speedy! Try slowing down a little.' }
  return { icon: '🎵', text: 'Smooth and steady!' }
}

export const skillLabel = (id) => SKILLS.find((s) => s.id === id)
