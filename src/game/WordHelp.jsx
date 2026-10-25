import { useEffect, useRef } from 'react'
import { speak } from '../components/SpeakButton.jsx'
import { syllables } from './syllables.js'

// Pop-up help for one word: hear it, hear it slowly, and see it in parts.
export default function WordHelp({ word, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  // "dong," → "dong", "\"That" → "That"
  const label = word.display.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '')
  const parts = syllables(label)

  // Say the word once when the panel opens.
  useEffect(() => {
    panelRef.current?.focus()
    speak(label, { rate: 0.8 })
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [label])

  return (
    <div className="word-help-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="word-help"
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-help-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="word-help-kicker">Need help with this word?</p>
        <h2 className="word-help-word" id="word-help-title">
          {label}
        </h2>

        <div className="word-help-actions">
          <button type="button" className="t-chip" onClick={() => speak(label, { rate: 0.9 })}>
            🔊 Hear it
          </button>
          <button type="button" className="t-chip" onClick={() => speak(label, { rate: 0.45 })}>
            🐢 Hear it slowly
          </button>
        </div>

        {parts.length > 1 && (
          <div className="word-parts">
            <p className="note">Say it in parts — tap each one:</p>
            <div className="part-row">
              {parts.map((part, i) => (
                <button
                  key={i}
                  type="button"
                  className="part"
                  onClick={() => speak(part, { rate: 0.6 })}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="button" className="start" onClick={onClose}>
          Got it! Keep reading 👍
        </button>
      </div>
    </div>
  )
}
