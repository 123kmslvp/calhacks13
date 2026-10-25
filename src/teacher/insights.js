import { averageSkill } from '../data/roster.js'

// Turns a student's session history into what a teacher needs at a glance:
// reading accuracy, words correct per minute, comprehension, engagement,
// and weekly trends.

const DAY = 86400000
const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

export function studentInsights(student, now = Date.now()) {
  const history = student.history ?? []
  const weekAgo = now - 7 * DAY
  const thisWeek = history.filter((h) => new Date(h.date) >= weekAgo)
  const aloud = history.filter((h) => h.wcpm !== undefined)
  const recentAloud = aloud.slice(-3)
  const quizzes = history.filter((h) => h.quiz)

  // Comprehension change: last three quizzes vs. the three before them.
  const lastQ = avg(quizzes.slice(-3).map((h) => h.quiz.score))
  const prevQ = avg(quizzes.slice(-6, -3).map((h) => h.quiz.score))

  return {
    accuracy: student.reading?.accuracy ?? null,
    wcpm: avg(recentAloud.map((h) => h.wcpm)),
    comprehension: averageSkill(student),
    comprehensionTrend: lastQ !== null && prevQ !== null ? lastQ - prevQ : null,
    sessionsThisWeek: thisWeek.length,
    minutesThisWeek: Math.round(thisWeek.reduce((s, h) => s + (h.seconds ?? 0), 0) / 60) + thisWeek.filter((h) => h.quiz).length * 3,
    storiesCompleted: student.reading?.storiesCompleted ?? 0,
    readAloudShare: history.length ? Math.round((aloud.length / history.length) * 100) : 0,
  }
}

// Weekly averages over the last `weeks` weeks (oldest first). Weeks with no
// reading have nulls so the chart shows a gap instead of a fake zero.
export function weeklySeries(student, weeks = 8, now = Date.now()) {
  const history = student.history ?? []
  const series = []
  for (let w = weeks - 1; w >= 0; w--) {
    const end = now - w * 7 * DAY
    const start = end - 7 * DAY
    const inWeek = history.filter((h) => {
      const t = new Date(h.date).getTime()
      return t > start && t <= end
    })
    series.push({
      label: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions: inWeek.length,
      accuracy: avg(inWeek.filter((h) => h.accuracy !== undefined).map((h) => h.accuracy)),
      comprehension: avg(inWeek.filter((h) => h.quiz).map((h) => h.quiz.score)),
      wcpm: avg(inWeek.filter((h) => h.wcpm !== undefined).map((h) => h.wcpm)),
    })
  }
  return series
}
