import { useEffect, useRef, useState } from 'react'
import { resetPrefs, setPref, usePrefs } from './accessibility.js'
import { speak } from '../components/SpeakButton.jsx'
import './accessibility.css'

const SIZES = [
  { id: 'normal', label: 'Normal' },
  { id: 'large', label: 'Big' },
  { id: 'xlarge', label: 'Biggest' },
]
const FONTS = [
  { id: 'playful', label: 'Playful' },
  { id: 'clear', label: 'Clear' },
  { id: 'dyslexia', label: 'Easy read' },
]
const TOGGLES = [
  { id: 'readAloud', icon: '🔊', label: 'Read to me', hint: 'Poppy reads questions and prompts out loud' },
  { id: 'slowVoice', icon: '🐢', label: 'Slow voice', hint: 'Every voice talks more slowly' },
  { id: 'spacing', icon: '↕️', label: 'Roomy lines', hint: 'More space between letters and lines' },
  { id: 'contrast', icon: '🌗', label: 'Strong colors', hint: 'Darker text and clearer edges' },
  { id: 'calm', icon: '🌿', label: 'Calm screen', hint: 'No wiggling, bouncing, or flashing' },
]

// The "Aa" button, on every screen, that opens the comfort settings.
export default function AccessibilityPanel() {
  const prefs = usePrefs()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="comfort-fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Comfort settings: text size, letters, voice and more"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span aria-hidden="true">Aa</span>
      </button>

      {open && (
        <section className="comfort-panel" role="dialog" aria-labelledby="comfort-title" tabIndex={-1} ref={panelRef}>
          <div className="comfort-head">
            <h2 id="comfort-title">Make it comfy</h2>
            <button type="button" className="comfort-close" aria-label="Close settings" onClick={close}>
              ✕
            </button>
          </div>
          <p className="comfort-note">Pick what helps you learn best. You can change it any time.</p>

          <fieldset className="comfort-group">
            <legend>Text size</legend>
            <div className="comfort-row">
              {SIZES.map((s) => (
                <button key={s.id} type="button" aria-pressed={prefs.textSize === s.id} className="comfort-opt" onClick={() => setPref('textSize', s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="comfort-group">
            <legend>Letters</legend>
            <div className="comfort-row">
              {FONTS.map((f) => (
                <button key={f.id} type="button" aria-pressed={prefs.font === f.id} className={`comfort-opt font-${f.id}`} onClick={() => setPref('font', f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="comfort-toggles">
            {TOGGLES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="switch"
                aria-checked={prefs[t.id]}
                className="comfort-toggle"
                onClick={() => {
                  setPref(t.id, !prefs[t.id])
                  if (t.id === 'readAloud' && !prefs.readAloud) speak('I will read to you.')
                }}
              >
                <span className="comfort-icon" aria-hidden="true">{t.icon}</span>
                <span className="comfort-text">
                  <strong>{t.label}</strong>
                  <small>{t.hint}</small>
                </span>
                <span className="comfort-state">{prefs[t.id] ? '✓ On' : 'Off'}</span>
              </button>
            ))}
          </div>

          <button type="button" className="comfort-reset" onClick={resetPrefs}>
            Start over
          </button>
        </section>
      )}
    </>
  )
}
