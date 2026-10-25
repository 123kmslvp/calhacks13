import { useState } from 'react'
import Poppy from './components/Poppy.jsx'
import SpeakButton from './components/SpeakButton.jsx'
import { AVATARS, TEACHER } from './data/roster.js'
import { POPPY_ITEMS, isItemUnlocked, poppyGrowth } from './data/progress.js'
import { recommendStory } from './game/AdventureMap.jsx'
import { readStories } from './game/arcade/Arcade.jsx'

const ordinal = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

// The student's home: two big choices — read a story or play games — plus
// their progress. Everything else lives inside those.
export default function StudentPage({ student, className, onLogout, onStart, onProgress, onUpdate, onArcade }) {
  const [pickingBuddy, setPickingBuddy] = useState(false)
  const growth = poppyGrowth(student.points)
  const poppyItem = POPPY_ITEMS.find((i) => i.id === student.poppyItem && isItemUnlocked(i.id, student.points))
  const next = recommendStory(student)
  const gamesLocked = readStories(student).length === 0
  const greeting = `Hi ${student.firstName}! What do you want to do today? Read a story, or play games?`

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-wide">
        <header className="student-bar">
          <button
            type="button"
            className="student-avatar avatar-btn"
            aria-label={`Your buddy is ${student.avatar}. Change your buddy`}
            aria-expanded={pickingBuddy}
            onClick={() => setPickingBuddy(!pickingBuddy)}
          >
            {student.avatar}
                      </button>
          <div className="student-info">
            <strong>{student.firstName}</strong>
            <span>
              {ordinal(student.grade)} grade · {className ?? `${TEACHER.name}'s class`}
            </span>
          </div>
          <div className="points" aria-label={`${student.points} Pop Points`}>
            ⭐ {student.points}
          </div>
        </header>

        {pickingBuddy && (
          <div className="buddy-picker" role="group" aria-label="Choose your reading buddy">
            <span className="note">Pick your buddy</span>
            <div className="buddy-grid">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={a === student.avatar ? 'buddy selected' : 'buddy'}
                  aria-pressed={a === student.avatar}
                  onClick={() => {
                    onUpdate({ avatar: a })
                    setPickingBuddy(false)
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bubble">
          <Poppy size="small" stage={growth.stage} item={poppyItem} />
          <p className="message">
            Hi <strong>{student.firstName}</strong>! What do you want to do?
          </p>
          <SpeakButton text={greeting} />
        </div>

        <div className="home-choices">
          <button type="button" className="home-card home-read" onClick={() => onStart({ preferences: [] })}>
            <span className="home-icon" aria-hidden="true">📚</span>
            <strong>Read a story</strong>
                      </button>
          <button type="button" className={gamesLocked ? 'home-card home-play locked' : 'home-card home-play'} onClick={onArcade}>
            <span className="home-icon" aria-hidden="true">{gamesLocked ? '🔒' : '🎮'}</span>
            <strong>Play games</strong>
            {gamesLocked && <span>Read a story first</span>}
          </button>
        </div>

        <button type="button" className="poppy-teaser" onClick={onProgress}>
          <span className="teaser-text">
            <strong>My progress</strong>
            <span className="grow-meter" aria-hidden="true">
              <span style={{ width: `${Math.max(growth.progress * 100, 4)}%` }} />
            </span>
          </span>
          <span className="teaser-go">→</span>
        </button>

        <div className="step-nav">
          <button type="button" className="back" onClick={onLogout}>
            Log out
          </button>
        </div>
      </section>
    </main>
  )
}
