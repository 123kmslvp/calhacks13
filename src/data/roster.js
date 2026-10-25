// Classes and students shared by the teacher and student sides.
// There's no backend yet, so everything lives in localStorage. Passwords must
// never be stored or checked in the browser like this in a real deployment.

import { BADGES, emptyCounters } from './badges.js'

const STORAGE_KEY = 'kernelquest.school.v5'

export const TEACHER = {
  name: 'Ms. Lopez',
  username: 'ms.lopez',
  password: 'teach123',
}

export const GRADES = [3, 4, 5]

// Comprehension skills, one per kind of question in the stories.
// `label` is for teachers and parents; `kid` and `hint` are for students.
export const SKILLS = [
  { id: 'mainIdea', label: 'Finding the main idea', kid: 'Big idea', hint: 'What the story is mostly about' },
  { id: 'details', label: 'Recalling key details', kid: 'Important details', hint: 'Remembering what happened' },
  { id: 'vocabulary', label: 'Understanding vocabulary', kid: 'Word meanings', hint: 'Knowing what new words mean' },
  { id: 'inference', label: 'Making inferences', kid: 'Reading between the lines', hint: 'Figuring out what the story hints at' },
  { id: 'prediction', label: 'Making predictions', kid: 'Predicting', hint: 'Guessing what will happen next' },
  { id: 'factOpinion', label: 'Fact vs. opinion', kid: 'Fact or opinion', hint: 'Telling what’s true from what someone thinks' },
  { id: 'evidence', label: 'Explaining with evidence', kid: 'Using evidence', hint: 'Showing proof from the story' },
]

export const TOOLS = [
  { id: 'read', icon: '📖', label: 'Read it myself' },
  { id: 'listen', icon: '🎧', label: 'Listen to the story' },
  { id: 'visuals', icon: '🖼️', label: 'Show me pictures' },
  { id: 'readAloud', icon: '🗣️', label: 'Read it out loud' },
  { id: 'type', icon: '⌨️', label: 'Type my answers' },
  { id: 'speak', icon: '🎤', label: 'Say my answers' },
]

// Supportive groupings. These describe where a student is right now so the
// teacher knows how to help — not a fixed label. Students never see them.
export const CATEGORIES = [
  { id: 'support', label: 'Needs additional support', icon: '🌱' },
  { id: 'progressing', label: 'Progressing', icon: '🌿' },
  { id: 'strong', label: 'Demonstrating strong progress', icon: '🌳' },
  { id: 'new', label: 'Just getting started', icon: '✨' },
]

export const AVATARS = ['🦊', '🐼', '🐸', '🦄', '🐙', '🐯', '🐧', '🦖', '🐝', '🤖', '🐨', '🦉']
const PASSWORD_WORDS = ['corn', 'pop', 'kernel', 'snack', 'butter', 'salty', 'crunch', 'fluffy']

const DAY = 86400000
const daysAgo = (n) => new Date(Date.now() - n * DAY).toISOString()
// Local calendar day, e.g. "2026-10-24", used for the reading log.
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const emptyReading = () => ({
  storiesCompleted: 0,
  log: [],
  words: [],
  wins: [],
  chapterStars: {},
  trickyWords: [],
  accuracy: null,
})

// Moves a running score toward a new result gradually, so one tough day
// doesn't erase progress (and one lucky day doesn't overstate it).
export const blend = (before, now) => (before === null || before === undefined ? now : Math.round(before * 0.7 + now * 0.3))

// ---------- Sample class ----------
// Each sample student gets about eight weeks of believable reading sessions,
// generated from a fixed seed so the demo looks the same every time.

// Chapters from the story library (minus bonus worlds) that sample students have read.
const SEED_CHAPTERS = [
  { storyId: "bright-dragon", storyTitle: "Lumi and the Dark Forest", chapterId: "bright-dragon-1", chapterTitle: "Lumi and the Night", words: 106, grade: 3, vocab: ["shadows", "shivered", "explore"] },
  { storyId: "bright-dragon", storyTitle: "Lumi and the Dark Forest", chapterId: "bright-dragon-2", chapterTitle: "A Glow in the Night", words: 117, grade: 3, vocab: ["shaky", "glow", "amazement"] },
  { storyId: "community-garden", storyTitle: "The Garden on Maple Street", chapterId: "community-garden-1", chapterTitle: "The Empty Lot", words: 166, grade: 5, vocab: ["volunteers", "hauled", "forgotten"] },
  { storyId: "community-garden", storyTitle: "The Garden on Maple Street", chapterId: "community-garden-2", chapterTitle: "Two Good Ideas", words: 166, grade: 5, vocab: ["disagreement", "afford", "pollinators"] },
  { storyId: "lost-loop", storyTitle: "Poppy and the Lost Loop", chapterId: "lost-loop-1", chapterTitle: "The Missing Pattern", words: 83, grade: 3, vocab: ["pattern", "clue", "strange"] },
  { storyId: "lost-loop", storyTitle: "Poppy and the Lost Loop", chapterId: "lost-loop-2", chapterTitle: "Steps in Order", words: 97, grade: 3, vocab: ["sequence", "order", "steps"] },
  { storyId: "lost-loop", storyTitle: "Poppy and the Lost Loop", chapterId: "lost-loop-3", chapterTitle: "Fixing the Loop", words: 96, grade: 3, vocab: ["loop", "repeat", "debugging"] },
  { storyId: "otter-pup", storyTitle: "Kai the Otter Pup", chapterId: "otter-pup-1", chapterTitle: "Floating on Mom", words: 119, grade: 3, vocab: ["grooming", "kelp", "drift"] },
  { storyId: "otter-pup", storyTitle: "Kai the Otter Pup", chapterId: "otter-pup-2", chapterTitle: "The Rock Trick", words: 117, grade: 3, vocab: ["sleek", "tools", "raft"] },
  { storyId: "river-race", storyTitle: "The Great River Race", chapterId: "river-race-1", chapterTitle: "Ready, Set, Paddle", words: 144, grade: 4, vocab: ["steer", "opposite", "journey"] },
  { storyId: "river-race", storyTitle: "The Great River Race", chapterId: "river-race-2", chapterTitle: "The Rumble Rapids", words: 147, grade: 4, vocab: ["rapids", "channel", "rhythm"] },
  { storyId: "why-popcorn-pops", storyTitle: "Poppy Asks: Why Does Popcorn Pop?", chapterId: "why-popcorn-pops-1", chapterTitle: "A Secret Inside", words: 141, grade: 4, vocab: ["microscope", "hull", "starch"] },
  { storyId: "why-popcorn-pops", storyTitle: "Poppy Asks: Why Does Popcorn Pop?", chapterId: "why-popcorn-pops-2", chapterTitle: "Heat, Steam, Pop!", words: 144, grade: 4, vocab: ["steam", "pressure", "burst"] },
]

const SEED_RESPONSES = {
  strong: [
    {
      question: 'How did Poppy know something was wrong in the Kernel Kingdom? Use details from the story.',
      answer: 'The bells rang ding dong dong ding instead of the normal pattern. The story says "The pattern was broken!"',
      evidence: 'The pattern was broken!',
    },
    {
      question: 'What is a loop? Use the story to explain.',
      answer: 'A loop is when you repeat the same steps again and again, like the bells ringing the song over and over.',
      evidence: '"A loop will repeat the same steps."',
    },
  ],
  growing: [
    {
      question: 'How did Poppy know something was wrong in the Kernel Kingdom? Use details from the story.',
      answer: 'because the bells',
      followUp: 'Can you tell me more? What was different about the bells?',
      followUpAnswer: 'they rang in the wrong order',
    },
    {
      question: 'Why did Poppy need to put the steps in order? Explain using the story.',
      answer: 'so it works',
      followUp: 'Which part of the story shows that? Tap a sentence that proves it.',
      evidence: 'Then Poppy tried them one by one, and the first bell rang just right.',
    },
  ],
}

// Small deterministic random number generator (mulberry32).
function seededRandom(seedText) {
  let a = [...seedText].reduce((h, ch) => Math.imul(h ^ ch.charCodeAt(0), 16777619), 2166136261) >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const QUIZ_TYPES = [
  ['mainIdea', 'vocabulary', 'inference', 'evidence'],
  ['details', 'vocabulary', 'prediction', 'evidence'],
  ['mainIdea', 'factOpinion', 'inference', 'evidence'],
]
const TYPE_EASE = { details: 0.1, vocabulary: 0.05, mainIdea: 0, factOpinion: 0, prediction: -0.03, inference: -0.1, evidence: -0.14 }
const BASE_WCPM = { 3: 85, 4: 105, 5: 125 }

function seedStudent({ classId, firstName, lastName, grade, avatar, password, parentEmails, ability, trend, perWeek, lastActive, tools, tricky = [], poppyItem = null }) {
  const rand = seededRandom(firstName + lastName)
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
  // Stories closest to the student's grade come first, read in order.
  const storyOrder = [...new Set(SEED_CHAPTERS.map((c) => c.storyId))].sort((a, b) => {
    const ga = SEED_CHAPTERS.find((c) => c.storyId === a).grade
    const gb = SEED_CHAPTERS.find((c) => c.storyId === b).grade
    return Math.abs(ga - grade) - Math.abs(gb - grade) || a.localeCompare(b)
  })
  // Stronger readers have explored further; everyone rereads favorites.
  const explored = clamp(Math.round(3 + ability * 6), 3, 10)
  const readingOrder = storyOrder.flatMap((id) => SEED_CHAPTERS.filter((c) => c.storyId === id)).slice(0, explored)
  const history = []
  const weeks = 8
  let n = 0
  for (let w = 0; w < weeks; w++) {
    const count = Math.max(0, Math.round(perWeek + (rand() - 0.5) * 1.5))
    for (let i = 0; i < count; i++) {
      const ago = lastActive + (weeks - 1 - w) * 7 + Math.floor(rand() * 6)
      const t = 1 - ago / (weeks * 7)
      const level = clamp(ability + trend * (t - 0.5) * 2 + (rand() - 0.5) * 0.08, 0.1, 0.98)
      const chapter = readingOrder[n % readingOrder.length]
      const mode = ['aloud', 'aloud', 'listen', 'read'][Math.floor(rand() * 4)]
      const byType = {}
      for (const type of QUIZ_TYPES[n % QUIZ_TYPES.length]) {
        const p = clamp(level ** 1.4 + TYPE_EASE[type], 0.05, 0.97)
        byType[type] = rand() < p ? 100 : rand() < p ? 60 : 20
      }
      const quizScore = Math.round(Object.values(byType).reduce((a, b) => a + b, 0) / 4)
      const seconds = Math.round((chapter.words / (BASE_WCPM[grade] * (0.6 + 0.5 * level))) * 60)
      history.push({
        date: daysAgo(ago),
        storyId: chapter.storyId,
        storyTitle: chapter.storyTitle,
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        mode,
        seconds,
        ...(mode === 'aloud' && {
          accuracy: Math.round(clamp(42 + 56 * level + (rand() - 0.5) * 6, 35, 99)),
          wcpm: Math.round(BASE_WCPM[grade] * (0.55 + 0.55 * level) + (rand() - 0.5) * 10),
        }),
        quiz: { score: quizScore, byType },
      })
      n++
    }
  }
  history.sort((a, b) => a.date.localeCompare(b.date))
  if (history.length) history[history.length - 1].date = daysAgo(lastActive)

  // Roll the history up into the student's current picture.
  const skills = Object.fromEntries(SKILLS.map((s) => [s.id, null]))
  const reading = emptyReading()
  const counters = emptyCounters()
  let points = 0
  const logByDay = {}
  for (const h of history) {
    for (const [type, score] of Object.entries(h.quiz.byType)) skills[type] = blend(skills[type], score)
    if (h.accuracy !== undefined) {
      const before = reading.accuracy
      reading.accuracy = blend(before, h.accuracy)
      if (before !== null && reading.accuracy > before) counters.accuracyUps++
      counters.readAloud++
    }
    // Effort stars: read it, answered the questions, explained with evidence.
    const stars = 2 + (h.quiz.byType.evidence === 100 ? 1 : 0)
    reading.chapterStars[h.chapterId] = Math.max(reading.chapterStars[h.chapterId] ?? 0, stars)
    counters.modes[h.mode]++
    if (h.quiz.byType.evidence === 100) counters.evidence++
    if (Object.values(h.quiz.byType).includes(60)) counters.retries++
    points += 10 + Math.round(h.quiz.score / 10) + (h.accuracy >= 90 ? 10 : 0)
    const day = dayKey(new Date(h.date))
    logByDay[day] = (logByDay[day] ?? 0) + Math.max(1, Math.round(h.seconds / 60)) + 3 // + question time
  }
  reading.log = Object.entries(logByDay).map(([date, minutes]) => ({ date, minutes }))
  const readChapters = new Set(history.map((h) => h.chapterId))
  reading.storiesCompleted = storyOrder.filter((id) =>
    SEED_CHAPTERS.filter((c) => c.storyId === id).every((c) => readChapters.has(c.chapterId))
  ).length
  reading.words = readingOrder
    .filter((c) => readChapters.has(c.chapterId))
    .flatMap((c) => c.vocab)
    .map((word, i) => ({ word, mastered: rand() < ability + 0.15 || i % 3 === 0 }))
  reading.trickyWords = tricky.map((word, i) => ({
    word,
    display: word,
    helps: 1 + (i % 2),
    misses: 1 + ((i + 1) % 3),
    rescuedOn: i === 0 && ability > 0.5 ? dayKey(new Date(Date.now() - 2 * DAY)) : null,
    lastSeen: dayKey(new Date(Date.now() - (lastActive + i) * DAY)),
    sentenceText: '',
  }))
  const recent = history.slice(-3)
  if (recent.some((h) => h.quiz.byType.evidence === 100)) reading.wins.push({ type: 'evidence', date: dayKey(new Date(recent.at(-1).date)) })
  if (counters.accuracyUps) reading.wins.push({ type: 'accuracy', date: dayKey(new Date(recent.at(-1).date)) })

  const quality = ability >= 0.65 ? 'strong' : 'growing'
  const responses = SEED_RESPONSES[quality].map((r, i) => ({
    ...r,
    date: daysAgo(lastActive + i * 5),
    storyTitle: 'Poppy and the Lost Loop',
    mode: tools.includes('speak') ? 'spoken' : 'typed',
    quality,
  }))
  const lastWeekHistory = history.filter((h) => new Date(h.date) < new Date(Date.now() - 7 * DAY))

  const student = {
    id: `${firstName}-${lastName}`.toLowerCase(),
    classId,
    firstName,
    lastName,
    grade,
    avatar,
    username: `${firstName}.${lastName[0]}`.toLowerCase(),
    password,
    points,
    skills,
    sessions: history.length,
    lastActive: history.at(-1)?.date ?? null,
    toolsUsed: Object.fromEntries(tools.map((t, i) => [t, history.length - i * 2])),
    notes: '',
    parentEmails,
    lastReport: lastWeekHistory.length
      ? { sentAt: daysAgo(7), points: Math.round(points * 0.85), sessions: lastWeekHistory.length, skills: Object.fromEntries(Object.entries(skills).map(([k, v]) => [k, v === null ? null : Math.max(0, v - Math.round(rand() * 8))])) }
      : null,
    reading,
    history,
    responses,
    counters,
    badges: [],
    writings: [],
    poppyItem,
  }
  student.badges = BADGES.filter((b) => b.test(student)).map((b) => ({ id: b.id, date: student.lastActive }))
  return student
}

const SEED = {
  classes: [
    { id: 'room-12', name: 'Room 12' },
    { id: 'room-14', name: 'Room 14' },
  ],
  students: [
    seedStudent({ classId: 'room-12', firstName: 'Maya', lastName: 'Rivera', grade: 3, avatar: '🦊', password: 'popcorn25', parentEmails: ['rivera.family@example.com'], ability: 0.6, trend: 0.14, perWeek: 2, lastActive: 1, tools: ['listen', 'visuals', 'read'], tricky: ['sequence', 'debugging'], poppyItem: 'bow' }),
    seedStudent({ classId: 'room-12', firstName: 'Noah', lastName: 'Garcia', grade: 3, avatar: '🐸', password: 'snack31', parentEmails: [], ability: 0.36, trend: 0.1, perWeek: 1.3, lastActive: 6, tools: ['listen', 'speak', 'visuals'], tricky: ['strange', 'sequence', 'listened', 'debugging'] }),
    seedStudent({ classId: 'room-12', firstName: 'Zoe', lastName: 'Nguyen', grade: 3, avatar: '🐙', password: 'fluffy58', parentEmails: ['lan.nguyen@example.com', 'minh.nguyen@example.com'], ability: 0.7, trend: 0.06, perWeek: 2, lastActive: 3, tools: ['readAloud', 'read', 'speak'], tricky: ['debugging'] }),
    seedStudent({ classId: 'room-12', firstName: 'Sofia', lastName: 'Martinez', grade: 4, avatar: '🐨', password: 'butter23', parentEmails: ['martinez.home@example.com'], ability: 0.52, trend: 0.18, perWeek: 2.5, lastActive: 0, tools: ['readAloud', 'visuals', 'type'], tricky: ['sequence', 'strange'] }),
    seedStudent({ classId: 'room-14', firstName: 'Leo', lastName: 'Kim', grade: 5, avatar: '🐼', password: 'pop77', parentEmails: ['jkim@example.com'], ability: 0.76, trend: 0.08, perWeek: 2.5, lastActive: 0, tools: ['read', 'type', 'visuals'] }),
    seedStudent({ classId: 'room-14', firstName: 'Ava', lastName: 'Thomas', grade: 5, avatar: '🦄', password: 'kernel9', parentEmails: ['thomas.home@example.com'], ability: 0.9, trend: 0.04, perWeek: 3, lastActive: 2, tools: ['read', 'type'] }),
    seedStudent({ classId: 'room-14', firstName: 'Jamal', lastName: 'Brooks', grade: 4, avatar: '🦉', password: 'crunch64', parentEmails: ['brooks.family@example.com'], ability: 0.82, trend: 0.1, perWeek: 2, lastActive: 1, tools: ['readAloud', 'listen', 'speak'] }),
  ],
}

// Fills in any fields a saved student is missing (from an older version).
const withDefaults = (s) => ({
  parentEmails: [],
  lastReport: null,
  poppyItem: null,
  history: [],
  responses: [],
  badges: [],
  writings: [],
  ...s,
  reading: { ...emptyReading(), ...s.reading },
  counters: { ...emptyCounters(), ...s.counters, modes: { ...emptyCounters().modes, ...s.counters?.modes } },
  skills: { ...Object.fromEntries(SKILLS.map((k) => [k.id, null])), ...s.skills },
})

export function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.classes && saved?.students) return { ...saved, students: saved.students.map(withDefaults) }
  } catch {
    // Fall through to the sample classes if storage is unavailable or corrupt.
  }
  return SEED
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or blocked — everything still works for this visit.
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY)
  return SEED
}

const randomInt = (max) => crypto.getRandomValues(new Uint32Array(1))[0] % max

// Usernames are unique across every class, since students log in without
// picking a class first.
export function generateUsername(firstName, lastName, students) {
  const clean = (s) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '')
  const base = `${clean(firstName) || 'student'}.${clean(lastName).slice(0, 1) || 'x'}`
  const taken = new Set(students.map((s) => s.username))
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base}${n}`)) n++
  return `${base}${n}`
}

// Short, easy-to-type passwords a 3rd grader can manage.
export function generatePassword() {
  return PASSWORD_WORDS[randomInt(PASSWORD_WORDS.length)] + (10 + randomInt(90))
}

export function createClass(name) {
  return { id: `class-${Date.now()}-${randomInt(1e6)}`, name: name.trim() }
}

export function createStudent({ firstName, lastName, grade, classId, parentEmails = [] }, students) {
  return {
    id: `${Date.now()}-${randomInt(1e6)}`,
    classId,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    grade,
    avatar: AVATARS[randomInt(AVATARS.length)],
    username: generateUsername(firstName, lastName, students),
    password: generatePassword(),
    points: 0,
    skills: Object.fromEntries(SKILLS.map((s) => [s.id, null])),
    sessions: 0,
    lastActive: null,
    toolsUsed: {},
    notes: '',
    parentEmails,
    lastReport: null,
    reading: emptyReading(),
    history: [],
    responses: [],
    counters: emptyCounters(),
    badges: [],
    writings: [],
    poppyItem: null,
  }
}

// ---------- Parent emails ----------

const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/

export const MAX_PARENT_EMAILS = 2

// Splits "a@x.com, b@y.com" into valid and invalid addresses.
export function parseEmails(text) {
  const parts = String(text ?? '')
    .split(/[\s,;]+/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
  const valid = [...new Set(parts.filter((p) => EMAIL_RE.test(p)))]
  const invalid = parts.filter((p) => !EMAIL_RE.test(p))
  return { valid, invalid }
}

// Creates many students at once, making sure new usernames don't collide
// with each other either.
export function createStudents(rows, classId, students) {
  const created = []
  for (const row of rows) {
    created.push(createStudent({ ...row, classId }, [...students, ...created]))
  }
  return created
}

export function findStudent(students, username, password) {
  const u = username.trim().toLowerCase()
  return students.find((s) => s.username === u && s.password === password.trim()) ?? null
}

export function averageSkill(student) {
  const scores = Object.values(student.skills).filter((v) => v !== null)
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

// Overall picture for the teacher: comprehension and (when the student has
// read aloud) reading accuracy, weighted equally.
export function overallScore(student) {
  const parts = [averageSkill(student), student.reading?.accuracy ?? null].filter((v) => v !== null)
  return parts.length ? Math.round(parts.reduce((a, b) => a + b, 0) / parts.length) : null
}

export function categorize(student) {
  const avg = overallScore(student)
  if (avg === null || student.sessions < 2) return 'new'
  if (avg < 50) return 'support'
  if (avg < 80) return 'progressing'
  return 'strong'
}

export function daysSince(iso) {
  return iso ? Math.floor((Date.now() - new Date(iso)) / 86400000) : null
}

export function topTools(student, count = TOOLS.length) {
  return TOOLS.filter((t) => student.toolsUsed[t.id])
    .sort((a, b) => student.toolsUsed[b.id] - student.toolsUsed[a.id])
    .slice(0, count)
}

// Practical next steps for the teacher, based on where the student is now.
export function suggestions(student) {
  const name = student.firstName
  const category = categorize(student)

  if (category === 'new') {
    return [
      `Help ${name} log in for the first time with their login card.`,
      'Encourage them to try a few different tools so they find what works for them.',
    ]
  }

  const scored = SKILLS.filter((s) => student.skills[s.id] !== null).sort(
    (a, b) => student.skills[a.id] - student.skills[b.id]
  )
  const growth = scored[0].label.toLowerCase()
  const strength = scored[scored.length - 1].label.toLowerCase()
  const favoriteTools = topTools(student, 2).map((t) => t.label.toLowerCase())
  const away = daysSince(student.lastActive)

  const tips = []
  if (away !== null && away >= 5) {
    tips.push(`${name} hasn't read in ${away} days — a quick check-in could help.`)
  }
  const accuracy = student.reading?.accuracy
  if (accuracy !== null && accuracy !== undefined && accuracy < 75) {
    tips.push(`Reading accuracy is ${accuracy}%. Try having ${name} listen to a chapter first, then read it aloud — or partner read.`)
  }
  const tricky = (student.reading?.trickyWords ?? []).filter((w) => !w.rescuedOn).map((w) => w.display)
  if (tricky.length >= 2) {
    tips.push(`Practice these words together: ${tricky.slice(0, 4).join(', ')}.`)
  }
  const evidenceScore = student.skills?.evidence
  if (evidenceScore !== null && evidenceScore !== undefined && evidenceScore < 60) {
    tips.push(`Model "I know because the story says…" — ${name} is still learning to back up answers with evidence.`)
  }
  if (category === 'support') {
    tips.push(`Sit with ${name} for a short 1-on-1 on "${growth}".`)
    if (favoriteTools.length) {
      tips.push(`They engage most with ${favoriteTools.join(' and ')}. Keep those options handy.`)
    }
    tips.push(`Celebrate their strength in "${strength}" to build confidence.`)
  } else if (category === 'progressing') {
    tips.push(`Extra practice on "${growth}" would help most right now.`)
    tips.push(`They're doing well with "${strength}" — point that out!`)
  } else {
    tips.push(`Offer a challenge chapter to stretch their "${growth}" skills.`)
    tips.push(`${name} could be a buddy helper for classmates on "${strength}".`)
  }
  return tips.slice(0, 5)
}

// ---------- Uploading a class list ----------

// Splits one CSV/TSV line, respecting "quoted, values".
function splitLine(line, delimiter) {
  const cells = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        quoted = false
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === delimiter) {
      cells.push(cell.trim())
      cell = ''
    } else {
      cell += ch
    }
  }
  cells.push(cell.trim())
  return cells
}

const HEADER_NAMES = {
  first: ['firstname', 'first', 'givenname', 'given'],
  last: ['lastname', 'last', 'surname', 'familyname', 'family'],
  full: ['name', 'fullname', 'studentname', 'student'],
  grade: ['grade', 'gradelevel', 'grd', 'year'],
}

const isEmailHeader = (h) =>
  h.includes('email') || ['parent', 'guardian', 'contact', 'parents', 'guardians'].includes(h)

function parseGrade(value) {
  const match = String(value ?? '').match(/\d+/)
  return match ? Number(match[0]) : null
}

// "Rivera, Maya" → Maya Rivera; "Maya Rivera" → Maya Rivera
function splitFullName(full) {
  if (full.includes(',')) {
    const [last, first] = full.split(',').map((p) => p.trim())
    return { firstName: first ?? '', lastName: last ?? '' }
  }
  const parts = full.trim().split(/\s+/)
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
}

// Turns a pasted or uploaded class list into rows ready to import.
// Accepts CSV or tab-separated text (pasted straight from Excel / Google
// Sheets), with or without a header row, using either first + last name
// columns or a single full-name column. Grade and parent email(s) are optional.
export function parseStudentList(text, { defaultGrade, classId, students }) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length === 0) return []

  const delimiter = lines.some((l) => l.includes('\t')) ? '\t' : ','
  let rows = lines.map((l) => splitLine(l, delimiter))

  const normalize = (h) => h.toLowerCase().replace(/[^a-z]/g, '')
  const header = rows[0].map(normalize)
  const col = {}
  for (const [key, names] of Object.entries(HEADER_NAMES)) {
    const i = header.findIndex((h) => names.includes(h))
    if (i !== -1) col[key] = i
  }
  const emailCols = header.map((h, i) => (isEmailHeader(h) ? i : -1)).filter((i) => i !== -1)
  const hasHeader = Object.keys(col).length > 0 || emailCols.length > 0

  // Without a header, any cell containing "@" is treated as a parent email
  // and the rest of the row is read as name / grade.
  let rowEmails = rows.map(() => [])
  if (hasHeader) {
    rows = rows.slice(1)
    rowEmails = rows.map((cells) => emailCols.map((i) => cells[i] ?? ''))
  } else {
    rowEmails = rows.map((cells) => cells.filter((c) => c.includes('@')))
    rows = rows.map((cells) => cells.filter((c) => !c.includes('@')))
    // Guess columns from the shape of the first row.
    const width = rows[0].length
    const lastLooksLikeGrade = parseGrade(rows[0][width - 1]) !== null
    if (width >= 3) Object.assign(col, { first: 0, last: 1, grade: 2 })
    else if (width === 2 && lastLooksLikeGrade) Object.assign(col, { full: 0, grade: 1 })
    else if (width === 2) Object.assign(col, { first: 0, last: 1 })
    else col.full = 0
  }

  const nameKey = (first, last) => `${first} ${last}`.toLowerCase()
  const existing = new Set(
    students.filter((s) => s.classId === classId).map((s) => nameKey(s.firstName, s.lastName))
  )
  const seen = new Set()

  return rows
    .map((cells, i) => ({ cells, emailText: rowEmails[i].join(',') }))
    .filter(({ cells, emailText }) => emailText || cells.some((c) => c !== ''))
    .map(({ cells, emailText }) => {
      const names =
        col.first !== undefined
          ? { firstName: cells[col.first] ?? '', lastName: cells[col.last] ?? '' }
          : splitFullName(cells[col.full] ?? '')
      const rawGrade = col.grade !== undefined ? cells[col.grade] : ''
      const grade = rawGrade ? parseGrade(rawGrade) : defaultGrade
      const key = nameKey(names.firstName, names.lastName)

      let problem = null
      if (!names.firstName) problem = 'Missing first name'
      else if (!names.lastName) problem = 'Missing last name'
      else if (!GRADES.includes(grade)) problem = `Grade "${rawGrade}" isn't 3, 4, or 5`
      else if (existing.has(key)) problem = 'Already in this class'
      else if (seen.has(key)) problem = 'Listed twice'
      seen.add(key)

      const { valid, invalid } = parseEmails(emailText)
      const parentEmails = valid.slice(0, MAX_PARENT_EMAILS)
      let emailNote = null
      if (invalid.length) emailNote = `Email "${invalid[0]}" looks wrong — left out`
      else if (parentEmails.length === 0) emailNote = 'No parent email'

      return { ...names, grade, parentEmails, problem, emailNote }
    })
}

export const TEMPLATE_CSV =
  'First Name,Last Name,Grade,Parent Email,Parent Email 2\n' +
  'Maya,Rivera,3,rivera.family@example.com,\n' +
  'Leo,Kim,5,jkim@example.com,sam.kim@example.com\n'
