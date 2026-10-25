import { useState } from 'react'
import { TEACHER } from '../data/roster.js'

export default function TeacherLogin({ onBack, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo-only check; replace with real teacher auth on the backend.
    if (
      username.trim().toLowerCase() === TEACHER.username &&
      password === TEACHER.password
    ) {
      onLogin()
    } else {
      setError("That username or password doesn't match.")
    }
  }

  return (
    <main className="welcome">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />

      <section className="card">
        <h1 className="heading">Teacher sign in 🍎</h1>
        <p className="note">Manage your class, student logins, and progress.</p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Username</span>
            <input
              type="text"
              value={username}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
            />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="step-nav">
            <button type="button" className="back" onClick={onBack}>
              ← Student login
            </button>
            <button type="submit" className="start" disabled={!username.trim() || !password}>
              Sign in
            </button>
          </div>
        </form>

        <p className="demo-hint">
          Demo login: <code>{TEACHER.username}</code> / <code>{TEACHER.password}</code>
        </p>
      </section>
    </main>
  )
}
