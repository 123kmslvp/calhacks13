// Badges recognize effort, improvement, and persistence — not only perfect
// answers. Most are earned by trying: reading aloud, trying again after a
// miss, explaining your thinking, practicing tricky words.

export const BADGES = [
  { id: 'first-steps', icon: '🌟', name: 'First Adventure', about: 'Finished your first chapter', test: (s) => s.history.length >= 1 },
  { id: 'brave-reader', icon: '🎤', name: 'Brave Reader', about: 'Read aloud five times', test: (s) => c(s).readAloud >= 5 },
  { id: 'never-give-up', icon: '💪', name: 'Never Give Up', about: 'Tried again after a tricky question five times', test: (s) => c(s).retries >= 5 },
  { id: 'evidence-detective', icon: '🔍', name: 'Evidence Detective', about: 'Explained three answers using evidence from the story', test: (s) => c(s).evidence >= 3 },
  { id: 'big-thinker', icon: '💭', name: 'Big Thinker', about: 'Answered three "tell me more" questions', test: (s) => c(s).followUps >= 3 },
  { id: 'word-rescuer', icon: '🛟', name: 'Word Rescuer', about: 'Rescued ten tricky words', test: (s) => c(s).rescued >= 10 },
  { id: 'explorer', icon: '🧭', name: 'Explorer', about: 'Tried reading, listening, and reading aloud', test: (s) => ['read', 'listen', 'aloud'].every((m) => (c(s).modes?.[m] ?? 0) > 0) },
  { id: 'growing-reader', icon: '🌱', name: 'Growing Reader', about: 'Improved your reading accuracy three times', test: (s) => c(s).accuracyUps >= 3 },
  { id: 'on-a-roll', icon: '🔥', name: 'On a Roll', about: 'Read three days in a row', test: (s) => longestStreak(s.reading.log) >= 3 },
  { id: 'bookworm', icon: '📚', name: 'Bookworm', about: 'Finished three whole stories', test: (s) => s.reading.storiesCompleted >= 3 },
  { id: 'story-artist', icon: '🎨', name: 'Story Artist', about: 'Drew three favorite scenes', test: (s) => c(s).drawings >= 3 },
  { id: 'game-champ', icon: '🎮', name: 'Game Champ', about: 'Played five story games', test: (s) => (c(s).games ?? 0) >= 5 },
  { id: 'story-writer', icon: '✍️', name: 'Story Writer', about: 'Finished a writing activity', test: (s) => c(s).writings >= 1 },
]

export const emptyCounters = () => ({
  readAloud: 0,
  retries: 0,
  evidence: 0,
  followUps: 0,
  rescued: 0,
  accuracyUps: 0,
  drawings: 0,
  writings: 0,
  modes: { read: 0, listen: 0, aloud: 0 },
})

const c = (s) => s.counters ?? emptyCounters()

function longestStreak(log = []) {
  const days = [...new Set(log.map((e) => e.date))].sort()
  let best = 0
  let run = 0
  let prev = null
  for (const d of days) {
    const date = new Date(`${d}T00:00:00`)
    run = prev && Math.round((date - prev) / 86400000) === 1 ? run + 1 : 1
    best = Math.max(best, run)
    prev = date
  }
  return best
}

// Badges the student has now earned but didn't have before.
export function newBadges(student) {
  const have = new Set((student.badges ?? []).map((b) => b.id))
  return BADGES.filter((b) => !have.has(b.id) && b.test(student))
}

export const badgeById = (id) => BADGES.find((b) => b.id === id)
