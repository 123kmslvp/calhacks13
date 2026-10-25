import { useState } from 'react'
import { MAX_PARENT_EMAILS, parseEmails } from '../data/roster.js'

// Text field for one or two parent/guardian emails, separated by a comma.
// Calls onSave with the valid addresses when the field loses focus or the
// teacher presses Enter / Save.
export default function EmailField({ emails, onSave, showSave = false, label = 'Parent / guardian email' }) {
  const [text, setText] = useState(emails.join(', '))
  const [error, setError] = useState('')

  const commit = () => {
    const { valid, invalid } = parseEmails(text)
    if (invalid.length) {
      setError(`"${invalid[0]}" doesn't look like an email.`)
      return
    }
    if (valid.length > MAX_PARENT_EMAILS) {
      setError(`Add up to ${MAX_PARENT_EMAILS} emails.`)
      return
    }
    setError('')
    setText(valid.join(', '))
    onSave(valid)
  }

  return (
    <label className="email-field">
      <span>{label}</span>
      <span className="email-row">
        <input
          type="text"
          inputMode="email"
          autoComplete="off"
          value={text}
          placeholder="parent@example.com"
          aria-invalid={!!error}
          onChange={(e) => {
            setText(e.target.value)
            setError('')
          }}
          onBlur={showSave ? undefined : commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit()
            }
          }}
        />
        {showSave && (
          <button type="button" className="t-btn primary small" onClick={commit} disabled={!text.trim()}>
            Save
          </button>
        )}
      </span>
      {error ? (
        <span className="field-error" role="alert">{error}</span>
      ) : (
        <span className="field-hint">Two emails? Separate them with a comma.</span>
      )}
    </label>
  )
}
