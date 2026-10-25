import { useState } from 'react'
import Poppy from './components/Poppy.jsx'
import SpeakButton from './components/SpeakButton.jsx'
import { TEACHER, TOOLS } from './data/roster.js'
import { POPPY_ITEMS, isItemUnlocked, poppyGrowth } from './data/progress.js'

// Tools are framed as choices for today, not traits of the student — any mix
// is fine, none are required, and they can be switched at any time.
const ordinal = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

export default function StudentPage({ student, className, onLogout, onStart, onProgress }) {
  const [preferences, setPreferences] = useState([])

  const togglePref = (id) =>
    setPreferences((prefs) =>
      prefs.includes(id) ? prefs.filter((p) => p !== id) : [...prefs, id]
    )

  const growth = poppyGrowth(student.points)
  const poppyItem = POPPY_ITEMS.find(
    (i) => i.id === student.poppyItem && isItemUnlocked(i.id, student.points)
  )

  const greeting = `Hey ${student.firstName}! How do you want to explore today? Pick as many as you like. You can switch anytime!`

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-wide">
        <header className="student-bar">
          <span className="student-avatar" aria-hidden="true">{student.avatar}</span>
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

        <div className="bubble">
          <Poppy size="small" stage={growth.stage} item={poppyItem} />
          <p className="message">
            Hey <strong>{student.firstName}</strong>! 🎉 How do you want to explore today?
          </p>
          <SpeakButton text={greeting} />
        </div>

        <button type="button" className="poppy-teaser" onClick={onProgress}>
          <span className="teaser-text">
            <strong>
              Poppy is a {growth.stage.name}! ⭐ {student.points} Pop Points
            </strong>
            <span className="grow-meter" aria-hidden="true">
              <span style={{ width: `${Math.max(growth.progress * 100, 4)}%` }} />
            </span>
            <span className="comp-hint">
              {growth.next
                ? `${growth.toNext} more points to help Poppy grow into a ${growth.next.name}`
                : 'Poppy is fully grown!'}
            </span>
          </span>
          <span className="teaser-go">My progress →</span>
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onStart({ preferences })
          }}
        >
          <fieldset className="group" aria-labelledby="explore-heading">
            <h2 className="heading" id="explore-heading">Pick your tools</h2>
            <p className="note">Pick as many as you like — you can switch anytime!</p>
            <div className="pref-list">
              {TOOLS.map((pref) => {
                const on = preferences.includes(pref.id)
                return (
                  <button
                    key={pref.id}
                    type="button"
                    className={on ? 'pref selected' : 'pref'}
                    aria-pressed={on}
                    onClick={() => togglePref(pref.id)}
                  >
                    <span className="pref-icon" aria-hidden="true">{pref.icon}</span>
                    <span>{pref.label}</span>
                    <span className="pref-check" aria-hidden="true">{on ? '✓' : ''}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="step-nav">
            <button type="button" className="back" onClick={onLogout}>
              Log out
            </button>
            <button type="submit" className="start">
              Start My Story 📖
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
