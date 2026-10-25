import { CATEGORIES, SKILLS, averageSkill, categorize } from '../data/roster.js'
import { studentInsights, weeklySeries } from './insights.js'

// Rolls a whole class's reading history up into what a teacher needs to plan
// instruction: headline numbers, weekly trends, and which skills (and which
// students) need another look.

const DAY = 86400000
const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)
const present = (v) => v !== null && v !== undefined

// Below this a skill score counts as "needs practice".
export const PRACTICE_BELOW = 60

// Short column names for charts; the full SKILLS label goes in tooltips.
export const SKILL_SHORT = {
  mainIdea: 'Main idea',
  details: 'Details',
  vocabulary: 'Vocabulary',
  inference: 'Inference',
  prediction: 'Prediction',
  factOpinion: 'Fact / opinion',
  evidence: 'Evidence',
}

// Weekly class averages (oldest first). Sessions from every student are pooled,
// so a student who reads more counts more — the same way the class experiences it.
export function classWeeklySeries(roster, weeks = 8, now = Date.now()) {
  const pooled = weeklySeries({ history: roster.flatMap((s) => s.history ?? []) }, weeks, now)
  return pooled.map((row, i) => {
    const end = now - (weeks - 1 - i) * 7 * DAY
    const start = end - 7 * DAY
    const active = roster.filter((s) =>
      (s.history ?? []).some((h) => {
        const t = new Date(h.date).getTime()
        return t > start && t <= end
      })
    ).length
    return { ...row, active }
  })
}

// Average of a weekly column over the last `n` weeks vs. the `n` before.
function change(series, key, n = 4) {
  const recent = avg(series.slice(-n).map((r) => r[key]).filter(present))
  const before = avg(series.slice(-2 * n, -n).map((r) => r[key]).filter(present))
  return present(recent) && present(before) ? recent - before : null
}

export function classSummary(roster, series) {
  const infos = roster.map((s) => studentInsights(s))
  const [lastWeek, thisWeek] = series.slice(-2)
  return {
    students: roster.length,
    activeThisWeek: thisWeek?.active ?? 0,
    activeChange: thisWeek && lastWeek ? thisWeek.active - lastWeek.active : null,
    sessionsThisWeek: thisWeek?.sessions ?? 0,
    sessionsChange: thisWeek && lastWeek ? thisWeek.sessions - lastWeek.sessions : null,
    minutesThisWeek: infos.reduce((sum, i) => sum + i.minutesThisWeek, 0),
    comprehension: avg(roster.map(averageSkill).filter(present)),
    comprehensionChange: change(series, 'comprehension'),
    accuracy: avg(infos.map((i) => i.accuracy).filter(present)),
    accuracyChange: change(series, 'accuracy'),
    wcpm: avg(infos.map((i) => i.wcpm).filter(present)),
    wcpmChange: change(series, 'wcpm'),
  }
}

// One row per skill: class average and who is below the practice line.
// Weakest first, so the top of the list is what to teach next.
export function skillBreakdown(roster) {
  return SKILLS.map((skill) => {
    const scored = roster.filter((s) => present(s.skills?.[skill.id]))
    const practice = scored
      .filter((s) => s.skills[skill.id] < PRACTICE_BELOW)
      .sort((a, b) => a.skills[skill.id] - b.skills[skill.id])
    return {
      id: skill.id,
      label: skill.label,
      short: SKILL_SHORT[skill.id] ?? skill.label,
      average: avg(scored.map((s) => s.skills[skill.id])),
      scored: scored.length,
      practice,
    }
  }).sort((a, b) => (a.average ?? 101) - (b.average ?? 101))
}

// Spreadsheet-friendly export of the class, one row per student.
export function classCsv(roster) {
  const header = [
    'First name',
    'Last name',
    'Grade',
    'Group',
    'Reading accuracy (%)',
    'Words correct per minute',
    'Comprehension (%)',
    ...SKILLS.map((s) => `${s.label} (%)`),
    'Sessions this week',
    'Minutes this week',
    'Total sessions',
    'Stories completed',
    'Last active',
  ]
  const rows = roster.map((s) => {
    const info = studentInsights(s)
    return [
      s.firstName,
      s.lastName,
      s.grade,
      CATEGORIES.find((c) => c.id === categorize(s))?.label ?? '',
      info.accuracy,
      info.wcpm,
      info.comprehension,
      ...SKILLS.map((k) => s.skills?.[k.id]),
      info.sessionsThisWeek,
      info.minutesThisWeek,
      (s.history ?? []).length,
      info.storiesCompleted,
      s.lastActive ? s.lastActive.slice(0, 10) : '',
    ]
  })
  const cell = (v) => {
    const text = present(v) ? String(v) : ''
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\n')
}
