import { voiceSpeed } from '../a11y/accessibility.js'

// Reads text aloud so students who aren't reading yet can still set up.
// The student's "Slow voice" comfort setting slows every voice.
export function speak(text, { rate = 0.95, onEnd } = {}) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = rate * voiceSpeed()
  utterance.pitch = 1.2
  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export default function SpeakButton({ text }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null
  return (
    <button
      type="button"
      className="speak"
      onClick={() => speak(text)}
      aria-label="Hear Poppy say this"
      title="Hear Poppy say this"
    >
      🔊
    </button>
  )
}
