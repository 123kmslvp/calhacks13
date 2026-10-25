// Reads text aloud so students who aren't reading yet can still set up.
export function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  utterance.pitch = 1.2
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
