import { useState } from 'react'
import Poppy from './components/Poppy.jsx'
import SpeakButton from './components/SpeakButton.jsx'

// Framed as tools to try today, not traits of the student — any mix is fine,
// none are required, and they can be switched at any time.
const PREFERENCES = [
  { id: 'read', icon: '📖', label: 'Read it myself' },
  { id: 'listen', icon: '🎧', label: 'Listen to the story' },
  { id: 'visuals', icon: '🖼️', label: 'Show me pictures' },
  { id: 'readAloud', icon: '🗣️', label: 'Read it out loud' },
  { id: 'type', icon: '⌨️', label: 'Type my answers' },
  { id: 'speak', icon: '🎤', label: 'Say my answers' },
]

const ordinal = (n) => ({ 1: '1st', 2: '2nd', 3: '3rd' })[n] ?? `${n}th`

export default function StudentPage({ student, onLogout, onStart }) {
  const [preferences, setPreferences] = useState([])

  const togglePref = (id) =>
    setPreferences((prefs) =>
      prefs.includes(id) ? prefs.filter((p) => p !== id) : [...prefs, id]
    )

  const greeting = `Hey ${student.name}! How do you want to explore today? Pick as many as you like. You can switch anytime!`

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card card-wide">
        <header className="student-bar">
          <span className="student-avatar" aria-hidden="true">{student.avatar}</span>
          <div className="student-info">
            <strong>{student.name}</strong>
            <span>
              {ordinal(student.grade)} grade · {student.teacher}'s class
            </span>
          </div>
          <div className="points" aria-label={`${student.points} points`}>
            ⭐ {student.points}
          </div>
        </header>

        <div className="bubble">
          <Poppy size="small" />
          <p className="message">
            Hey <strong>{student.name}</strong>! 🎉 How do you want to explore today?
          </p>
          <SpeakButton text={greeting} />
        </div>

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
              {PREFERENCES.map((pref) => {
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
