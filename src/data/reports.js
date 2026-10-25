import { SKILLS, TEACHER, daysSince, topTools } from './roster.js'

// Weekly parent reports. Written for families: warm, specific, and focused on
// growth. Teacher-only groupings (like "needs additional support") are never
// included — parents get strengths, one next step, and a way to help at home.

export const REPORT_INTERVAL_DAYS = 7

const HOME_TIPS = {
  mainIdea:
    'After a show or a book at bedtime, ask: "What was that mostly about?" and help them say it in one sentence.',
  details:
    'Ask "who, what, where?" questions about something they read or watched today. Remembering details gets easier with practice!',
  vocabulary:
    'Pick a "word of the day" from a book or sign you see together, and try to use it three times before bedtime.',
  inference:
    'While reading together, pause and ask: "How do you think the character feels? What makes you think that?"',
  prediction:
    'Before turning a page or starting a new episode, ask: "What do you think will happen next? Why?"',
  factOpinion:
    'Play "fact or opinion?" at dinner: "Pizza has cheese" (fact) vs. "Pizza is the best food" (opinion).',
  evidence:
    'When they share an idea about a story, ask "How do you know?" and help them find the part that proves it.',
}

// How each student tool reads in a sentence to a parent.
const TOOL_PHRASES = {
  read: 'reading on their own',
  listen: 'listening to the story',
  visuals: 'pictures',
  readAloud: 'reading out loud',
  type: 'typing answers',
  speak: 'saying answers out loud',
}

const joinList = (items) =>
  items.length > 2 ? `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}` : items.join(' and ')

const formatDate = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export function reportWeek(now = new Date()) {
  const start = new Date(now.getTime() - 6 * 86400000)
  return `${formatDate(start)} – ${formatDate(now)}`
}

// "sent" if a report went out in the last week, otherwise "due".
// Students without a parent email are "noEmail".
export function reportStatus(student) {
  if (!student.parentEmails?.length) return 'noEmail'
  const days = daysSince(student.lastReport?.sentAt)
  return days !== null && days < REPORT_INTERVAL_DAYS ? 'sent' : 'due'
}

export function buildReport(student, className) {
  const name = student.firstName
  const since = student.lastReport ?? { points: 0, sessions: 0, skills: {} }
  const sessions = student.sessions - since.sessions
  const weekAgo = Date.now() - 7 * 86400000
  const thisWeek = (student.history ?? []).filter((h) => new Date(h.date) >= weekAgo)
  const minutes = Math.round(thisWeek.reduce((sum, h) => sum + (h.seconds ?? 0), 0) / 60)
  const stories = [...new Set(thisWeek.map((h) => h.storyTitle))]
  const points = student.points - since.points

  const skills = SKILLS.map((skill) => {
    const now = student.skills[skill.id]
    const before = since.skills?.[skill.id] ?? null
    return {
      ...skill,
      score: now,
      change: now !== null && before !== null ? now - before : null,
    }
  })
  const scored = skills.filter((s) => s.score !== null)
  const byScore = [...scored].sort((a, b) => b.score - a.score)
  const mostImproved = [...scored]
    .filter((s) => s.change > 0)
    .sort((a, b) => b.change - a.change)[0]
  const strength = mostImproved ?? byScore[0]
  const nextStep = byScore[byScore.length - 1]
  const tools = topTools(student, 2)

  const week = reportWeek()
  const subject = `${name}'s week in Kernel Quest (${week})`

  let celebrate
  if (scored.length === 0) {
    celebrate = `${name} is all set up and ready to start their first adventure!`
  } else if (mostImproved) {
    celebrate = `${name} grew the most in "${strength.label.toLowerCase()}" this week (up ${mostImproved.change}%). Great work!`
  } else {
    celebrate = `${name} is doing especially well at "${strength.label.toLowerCase()}".`
  }

  const activity =
    sessions > 0
      ? `${name} read ${sessions} ${sessions === 1 ? 'chapter' : 'chapters'}${minutes ? ` (about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} of reading)` : ''}${stories.length ? ` from ${joinList(stories.map((t) => `“${t}”`))}` : ''}, and earned ${points} Pop ${points === 1 ? 'Point' : 'Points'}.`
      : `${name} didn't play this week — that's okay! A little encouragement to log in can go a long way.`

  const homeTip =
    nextStep && nextStep !== strength
      ? HOME_TIPS[nextStep.id]
      : 'Ask them to tell you about the story — what happened, and what puzzle they solved.'

  const skillLines = skills.map((s) => {
    if (s.score === null) return `• ${s.label}: not started yet`
    const change = s.change > 0 ? ` (up ${s.change}%)` : ''
    return `• ${s.label}: ${s.score}%${change}`
  })

  const text = [
    'Hello!',
    '',
    `Here's ${name}'s week in Kernel Quest, where ${className ?? 'our class'} is building reading and thinking skills through stories.`,
    '',
    'THIS WEEK',
    `• ${activity}`,
    ...(tools.length ? [`• Favorite ways to learn: ${tools.map((t) => TOOL_PHRASES[t.id]).join(' and ')}`] : []),
    '',
    'SOMETHING TO CELEBRATE 🎉',
    celebrate,
    '',
    'SKILLS',
    ...skillLines,
    '',
    ...(nextStep && nextStep !== strength
      ? ['WHAT WE\'RE WORKING ON NEXT', `"${nextStep.label}"`, '']
      : []),
    'TRY THIS AT HOME',
    homeTip,
    '',
    'Questions? Just reply to this email.',
    '',
    `Thank you,`,
    TEACHER.name,
  ].join('\n')

  return {
    subject,
    week,
    activity,
    tools: tools.map((t) => ({ ...t, phrase: TOOL_PHRASES[t.id] })),
    celebrate,
    skills,
    nextStep: nextStep && nextStep !== strength ? nextStep : null,
    homeTip,
    text,
  }
}

// Snapshot taken when a report is sent, so next week's report shows changes.
export function markReported(student) {
  return {
    ...student,
    lastReport: {
      sentAt: new Date().toISOString(),
      points: student.points,
      sessions: student.sessions,
      skills: { ...student.skills },
    },
  }
}
