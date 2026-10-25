// Classes and students shared by the teacher and student sides.
// There's no backend yet, so everything lives in localStorage. Passwords must
// never be stored or checked in the browser like this in a real deployment.

const STORAGE_KEY = 'kernelquest.school.v3'

export const TEACHER = {
  name: 'Ms. Lopez',
  username: 'ms.lopez',
  password: 'teach123',
}

export const GRADES = [3, 4, 5]

export const SKILLS = [
  { id: 'patterns', label: 'Spotting patterns' },
  { id: 'sequencing', label: 'Putting steps in order' },
  { id: 'loops', label: 'Repeating with loops' },
  { id: 'debugging', label: 'Finding and fixing bugs' },
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
// teacher knows how to help — not a fixed label.
export const CATEGORIES = [
  { id: 'support', label: 'Needs additional support', icon: '🌱' },
  { id: 'progressing', label: 'Progressing', icon: '🌿' },
  { id: 'strong', label: 'Demonstrating strong progress', icon: '🌳' },
  { id: 'new', label: 'Just getting started', icon: '✨' },
]

const AVATARS = ['🦊', '🐼', '🐸', '🦄', '🐙', '🐯', '🐧', '🦖', '🐝', '🤖']
const PASSWORD_WORDS = ['corn', 'pop', 'kernel', 'snack', 'butter', 'salty', 'crunch', 'fluffy']

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString()
// Local calendar day, e.g. "2026-10-24", used for the reading log.
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const dayKeyAgo = (n) => dayKey(new Date(Date.now() - n * 86400000))

export const COMPREHENSION = [
  { id: 'accuracy', label: 'Reading accuracy', hint: 'Reading words correctly' },
  { id: 'evidence', label: 'Using evidence', hint: 'Showing proof from the story' },
  { id: 'retelling', label: 'Retelling the story', hint: 'Telling what happened in order' },
  { id: 'vocabulary', label: 'Word meanings', hint: 'Knowing what new words mean' },
]

export const emptyReading = () => ({
  storiesCompleted: 0,
  log: [],
  words: [],
  comprehension: Object.fromEntries(COMPREHENSION.map((c) => [c.id, null])),
  wins: [],
})

// Builds sample reading data: log is [daysAgo, minutes], words are
// [word, mastered], wins are [type, daysAgo].
function seedReading(storiesCompleted, log, words, comprehension, wins) {
  return {
    storiesCompleted,
    log: log.map(([ago, minutes]) => ({ date: dayKeyAgo(ago), minutes })),
    words: words.map(([word, mastered]) => ({ word, mastered })),
    comprehension,
    wins: wins.map(([type, ago]) => ({ type, date: dayKeyAgo(ago) })),
  }
}

// lastWeek is where the student stood when their last parent report went out,
// so the next report can show what changed.
function seedStudent(classId, firstName, lastName, grade, avatar, password, parentEmails, points, skills, sessions, lastActiveDaysAgo, toolsUsed, lastWeek, reading = emptyReading()) {
  return {
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
    sessions,
    lastActive: daysAgo(lastActiveDaysAgo),
    toolsUsed,
    notes: '',
    parentEmails,
    lastReport: lastWeek && { sentAt: daysAgo(7), ...lastWeek },
    reading,
    poppyItem: null,
  }
}

const SEED = {
  classes: [
    { id: 'room-12', name: 'Room 12' },
    { id: 'room-14', name: 'Room 14' },
  ],
  students: [
    seedStudent('room-12', 'Maya', 'Rivera', 3, '🦊', 'corn42', ['rivera.family@example.com'], 120, { patterns: 72, sequencing: 58, loops: 41, debugging: 35 }, 6, 1, { listen: 5, visuals: 4, read: 1 },
      { points: 80, sessions: 4, skills: { patterns: 64, sequencing: 55, loops: 33, debugging: 35 } },
      seedReading(3, [[0, 12], [1, 15], [3, 10], [5, 8]],
        [['pattern', true], ['sequence', true], ['repeat', true], ['predict', true], ['clue', true], ['loop', false], ['debug', false], ['evidence', false]],
        { accuracy: 78, evidence: 64, retelling: 58, vocabulary: 70 },
        [['evidence', 0], ['accuracy', 1], ['story', 3]])),
    seedStudent('room-12', 'Noah', 'Garcia', 3, '🐸', 'snack31', [], 60, { patterns: 45, sequencing: 38, loops: 30, debugging: 22 }, 4, 6, { listen: 4, speak: 3, visuals: 4 },
      { points: 50, sessions: 3, skills: { patterns: 40, sequencing: 38, loops: 30, debugging: 22 } },
      seedReading(1, [[6, 9], [8, 6]],
        [['pattern', true], ['clue', true], ['repeat', false], ['sequence', false]],
        { accuracy: 52, evidence: 30, retelling: 41, vocabulary: 45 },
        [['story', 6], ['words', 8]])),
    seedStudent('room-12', 'Zoe', 'Nguyen', 3, '🐙', 'fluffy58', ['lan.nguyen@example.com', 'minh.nguyen@example.com'], 210, { patterns: 66, sequencing: 74, loops: 55, debugging: 61 }, 9, 3, { readAloud: 5, read: 4, speak: 2 },
      { points: 170, sessions: 7, skills: { patterns: 60, sequencing: 70, loops: 48, debugging: 61 } },
      seedReading(4, [[3, 14], [4, 12], [5, 11]],
        [['pattern', true], ['sequence', true], ['predict', true], ['clue', true], ['loop', true], ['debug', false], ['evidence', false], ['algorithm', false], ['repeat', true]],
        { accuracy: 81, evidence: 55, retelling: 72, vocabulary: 66 },
        [['streak', 3], ['words', 4]])),
    seedStudent('room-14', 'Leo', 'Kim', 5, '🐼', 'pop77', ['jkim@example.com'], 340, { patterns: 88, sequencing: 81, loops: 76, debugging: 70 }, 12, 0, { read: 9, type: 10, visuals: 3 },
      { points: 280, sessions: 9, skills: { patterns: 85, sequencing: 78, loops: 70, debugging: 62 } },
      seedReading(6, [[0, 18], [1, 20], [2, 15], [4, 12]],
        [['algorithm', true], ['sequence', true], ['loop', true], ['debug', true], ['evidence', true], ['predict', true], ['variable', false], ['condition', false]],
        { accuracy: 88, evidence: 79, retelling: 83, vocabulary: 80 },
        [['streak', 0], ['evidence', 1]])),
    seedStudent('room-14', 'Ava', 'Thomas', 5, '🦄', 'kernel9', ['thomas.home@example.com'], 560, { patterns: 95, sequencing: 90, loops: 87, debugging: 82 }, 18, 2, { read: 15, type: 14 }, null,
      seedReading(9, [[2, 25], [3, 22], [4, 20], [5, 18]],
        [['algorithm', true], ['sequence', true], ['loop', true], ['debug', true], ['evidence', true], ['variable', true], ['condition', true], ['predict', true], ['efficient', false], ['binary', false]],
        { accuracy: 95, evidence: 88, retelling: 90, vocabulary: 92 },
        [['accuracy', 2], ['story', 3]])),
  ],
}

export function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.classes && saved?.students) {
      return {
        ...saved,
        students: saved.students.map((s) => ({
          parentEmails: [],
          lastReport: null,
          reading: emptyReading(),
          poppyItem: null,
          ...s,
        })),
      }
    }
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

export function categorize(student) {
  const avg = averageSkill(student)
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
    tips.push(`${name} hasn't played in ${away} days — a quick check-in could help.`)
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
  return tips
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
  'Leo,Kim,4,jkim@example.com,sam.kim@example.com\n'
