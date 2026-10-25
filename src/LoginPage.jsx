import { useState } from 'react'
import Poppy from './components/Poppy.jsx'
import SpeakButton from './components/SpeakButton.jsx'
import { findStudent } from './data/roster.js'

export default function LoginPage({ students, onBack, onLogin, onTeacher }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const student = findStudent(students, username, password)
    if (student) {
      onLogin(student)
    } else {
      setError("Hmm, that didn't work. Check your card from your teacher and try again!")
    }
  }

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card">
        <div className="bubble">
          <Poppy size="small" />
          <p className="message">Welcome back, explorer! Type in your secret login to start.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section-head">
            <h2 className="heading">Log in</h2>
            <SpeakButton text="Type your username and password. Your teacher gave them to you!" />
          </div>

          <label className="field">
            <span className="field-label">Username</span>
            <input
              type="text"
              value={username}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="like maya.r"
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
              />
              <button
                type="button"
                className="peek"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? '🙈' : '👀'}
              </button>
            </div>
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="step-nav">
            <button type="button" className="back" onClick={onBack}>
              ← Back
            </button>
            <button type="submit" className="start" disabled={!username.trim() || !password}>
              Let's Go!
            </button>
          </div>
        </form>

        <p className="demo-hint">
          Demo login: <code>maya.r</code> / <code>popcorn25</code>
        </p>
        <p className="demo-hint">
          <button type="button" className="back" onClick={onTeacher}>
            I'm a teacher
          </button>
        </p>
      </section>
    </main>
  )
}
